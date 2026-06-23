"use client";

import { OverlayShell } from "@/components/overlays/OverlayShell";
import { useOverlay } from "@/components/overlays/OverlayProvider";
import { AboutFlipCard } from "./AboutFlipCard";

/** Focus-trapped overlay with a flippable profile card and resume details. */
export function AboutOverlay() {
  const { view, closeOverlay } = useOverlay();
  const isOpen = view === "about";

  return (
    <OverlayShell isOpen={isOpen} onClose={closeOverlay} titleId="about-title" bare>
      <AboutFlipCard />
    </OverlayShell>
  );
}
