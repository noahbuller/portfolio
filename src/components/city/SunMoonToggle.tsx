"use client";

import { useEffect, useState } from "react";
import styles from "./SunMoonToggle.module.css";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function readDomTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * Clickable sun that sets into a moon (and back) to switch the site between
 * light and dark mode. Owns its own theme state directly against the DOM —
 * nothing else in the app needs to reactively read the theme, since every
 * other consumer is pure CSS driven by the `data-theme` attribute.
 */
export function SunMoonToggle() {
  // Starts "light" to match the server-rendered markup; synced to the real
  // persisted value in the effect below, after hydration completes, so the
  // two renders never mismatch.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Intentional one-time sync from the DOM (set by the anti-FOUC inline
    // script in layout.tsx before hydration) into React state, so this
    // component's render matches what's already on screen. Not an
    // externally-subscribed value, so useSyncExternalStore doesn't apply;
    // this is the standard "sync once after mount" exception.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(readDomTheme());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <span className={styles.iconTrack} aria-hidden="true">
        <svg
          className={styles.sunIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          className={styles.moonIcon}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          <circle
            cx="8"
            cy="11"
            r="0.9"
            fill="var(--building-shadow)"
            opacity="0.4"
          />
          <circle
            cx="12"
            cy="16"
            r="0.6"
            fill="var(--building-shadow)"
            opacity="0.4"
          />
        </svg>
      </span>
    </button>
  );
}
