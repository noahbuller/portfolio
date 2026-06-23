"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { hashToView, OverlayView, viewToHash } from "@/lib/overlayView";

interface OverlayContextValue {
  view: OverlayView;
  openAbout: () => void;
  openProjects: () => void;
  openProject: (slug: string) => void;
  openExperience: () => void;
  closeOverlay: () => void;
  goBack: () => void;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

function setUrlHash(view: OverlayView, replace = false) {
  const hash = viewToHash(view);
  const url = hash ? `${window.location.pathname}${hash}` : window.location.pathname;
  if (replace) {
    history.replaceState(null, "", url);
  } else {
    history.pushState(null, "", url);
  }
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<OverlayView>(() => {
    if (typeof window === "undefined") return null;
    return hashToView(window.location.hash);
  });
  const skipHashSync = useRef(false);

  const navigate = useCallback((next: OverlayView, replace = false) => {
    setView(next);
    skipHashSync.current = true;
    setUrlHash(next, replace);
  }, []);

  const openAbout = useCallback(() => navigate("about"), [navigate]);
  const openProjects = useCallback(() => navigate("projects"), [navigate]);
  const openProject = useCallback(
    (slug: string) => navigate({ type: "project", slug }),
    [navigate],
  );
  const openExperience = useCallback(() => navigate("experience"), [navigate]);
  const closeOverlay = useCallback(() => navigate(null), [navigate]);

  const goBack = useCallback(() => {
    if (typeof view === "object" && view?.type === "project") {
      navigate("projects");
    } else {
      closeOverlay();
    }
  }, [view, navigate, closeOverlay]);

  useEffect(() => {
    const onPopState = () => {
      skipHashSync.current = false;
      setView(hashToView(window.location.hash));
    };

    const onHashChange = () => {
      if (skipHashSync.current) {
        skipHashSync.current = false;
        return;
      }
      setView(hashToView(window.location.hash));
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <OverlayContext.Provider
      value={{
        view,
        openAbout,
        openProjects,
        openProject,
        openExperience,
        closeOverlay,
        goBack,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be used within OverlayProvider");
  }
  return ctx;
}

/** Safe optional hook for components that may render outside OverlayProvider. */
export function useOverlayOptional(): OverlayContextValue | null {
  return useContext(OverlayContext);
}
