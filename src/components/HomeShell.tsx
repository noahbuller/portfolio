"use client";

import { AboutModal } from "@/components/about/AboutModal";
import { AboutProvider } from "@/components/about/AboutProvider";
import { CityScene } from "@/components/city/CityScene";
import { FixedNav } from "@/components/nav/FixedNav";

export function HomeShell() {
  return (
    <AboutProvider>
      <FixedNav />
      <CityScene />
      <AboutModal />
    </AboutProvider>
  );
}
