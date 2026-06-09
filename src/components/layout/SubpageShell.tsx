"use client";

import { AboutModal } from "@/components/about/AboutModal";
import { AboutProvider } from "@/components/about/AboutProvider";
import { SiteNav } from "@/components/nav/SiteNav";
import styles from "./subpage.module.css";

interface SubpageShellProps {
  current?: "projects" | "experience";
  children: React.ReactNode;
}

/** Shared coastal shell for scrollable routes — nav, About modal, page gradient. */
export function SubpageShell({ current, children }: SubpageShellProps) {
  return (
    <AboutProvider>
      <div className={styles.shell}>
        <SiteNav current={current} />
        <main className={styles.main}>{children}</main>
        <AboutModal />
      </div>
    </AboutProvider>
  );
}
