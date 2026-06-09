"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface AboutContextValue {
  isOpen: boolean;
  openAbout: () => void;
  closeAbout: () => void;
}

const AboutContext = createContext<AboutContextValue | null>(null);

export function AboutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openAbout = useCallback(() => setIsOpen(true), []);
  const closeAbout = useCallback(() => setIsOpen(false), []);

  return (
    <AboutContext.Provider value={{ isOpen, openAbout, closeAbout }}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout() {
  const ctx = useContext(AboutContext);
  if (!ctx) {
    throw new Error("useAbout must be used within AboutProvider");
  }
  return ctx;
}

/** Safe optional hook for components that may render outside AboutProvider. */
export function useAboutOptional(): AboutContextValue | null {
  return useContext(AboutContext);
}
