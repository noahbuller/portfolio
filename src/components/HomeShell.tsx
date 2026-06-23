"use client";

import { AboutOverlay } from "@/components/about/AboutOverlay";
import { CityScene } from "@/components/city/CityScene";
import { FixedNav } from "@/components/nav/FixedNav";
import {
  ExperienceOverlay,
  OverlayProvider,
  ProjectsOverlay,
} from "@/components/overlays";

export function HomeShell() {
  return (
    <OverlayProvider>
      <FixedNav />
      <CityScene />
      <AboutOverlay />
      <ProjectsOverlay />
      <ExperienceOverlay />
    </OverlayProvider>
  );
}
