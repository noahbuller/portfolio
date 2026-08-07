"use client";

import { AboutOverlay } from "@/components/about/AboutOverlay";
import { CityScene } from "@/components/city/CityScene";
import { FixedNav } from "@/components/nav/FixedNav";
import {
  ExperienceOverlay,
  OverlayProvider,
  ProjectsOverlay,
  useOverlay,
} from "@/components/overlays";

// Marks the nav/scene inert (removed from hit-testing, tab order, and the
// a11y tree) while any overlay is open, so keyboard/screen-reader users
// tabbing through an open modal can't reach content hidden behind it.
function SceneBackground() {
  const { view } = useOverlay();

  return (
    <div inert={view !== null || undefined}>
      <FixedNav />
      <CityScene />
    </div>
  );
}

export function HomeShell() {
  return (
    <OverlayProvider>
      <SceneBackground />
      <AboutOverlay />
      <ProjectsOverlay />
      <ExperienceOverlay />
    </OverlayProvider>
  );
}
