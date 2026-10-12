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
import { trackOverlayOrigin } from "@/lib/overlayOrigin";
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
  const url = hash
    ? `${window.location.pathname}${hash}`
    : window.location.pathname;
  if (replace) {
    history.replaceState(null, "", url);
  } else {
    history.pushState(null, "", url);
  }
}

export function OverlayProvider({ children }: { children: ReactNode }) {
  // Starts null unconditionally so the client's first render matches the
  // server's (which never sees window.location.hash) — a direct load of a
  // URL like /#about would otherwise mismatch and force React to
  // re-render the overlay subtree, visible as a flash/snap-open. The real
  // hash is read just after mount instead (see the effect below).
  const [view, setView] = useState<OverlayView>(null);
  const skipHashSync = useRef(false);

  useEffect(() => {
    // Intentional one-time sync from the URL into React state, after
    // hydration completes — same "sync once after mount" exception as
    // SunMoonToggle's theme read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(hashToView(window.location.hash));
  }, []);

  useEffect(() => trackOverlayOrigin(), []);

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

  // Closing/stepping back replaces the current history entry instead of
  // pushing a new "closed" one — otherwise every close leaves a phantom
  // entry that reopens the overlay on the browser's next Back press.
  const closeOverlay = useCallback(() => navigate(null, true), [navigate]);

  const goBack = useCallback(() => {
    if (typeof view === "object" && view?.type === "project") {
      navigate("projects", true);
    } else {
      closeOverlay();
    }
  }, [view, navigate, closeOverlay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']"))
        return;

      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openAbout();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAbout]);

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
