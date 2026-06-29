"use client";

import { OverlayShell } from "@/components/overlays/OverlayShell";
import { useOverlay } from "@/components/overlays/OverlayProvider";
import { AboutContent } from "./AboutContent";

/** Focus-trapped glass modal with resume-sourced about information. */
export function AboutOverlay() {
  const { view, closeOverlay } = useOverlay();
  const isOpen = view === "about";

  return (
    <OverlayShell isOpen={isOpen} onClose={closeOverlay} titleId="about-title" size="wide">
      <AboutContent />
    </OverlayShell>
  );
}
