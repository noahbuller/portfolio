"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./OverlayShell.module.css";

export type OverlaySize = "compact" | "wide" | "full";

interface OverlayShellProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  size?: OverlaySize;
  modalClassName?: string;
  /** Renders children directly on the backdrop — no glass modal panel. */
  bare?: boolean;
  children: ReactNode;
}

const sizeClass: Record<OverlaySize, string | undefined> = {
  compact: undefined,
  wide: styles.modalWide,
  full: styles.modalFull,
};

// Matches --duration-normal in globals.css — kept as a literal here since
// the exit unmount timer runs in JS, not CSS, and has to agree with it.
const EXIT_DURATION_MS = 350;

/** Shared backdrop and glass panel for hash-driven overlays. */
export function OverlayShell({
  isOpen,
  onClose,
  titleId,
  size = "compact",
  modalClassName,
  bare = false,
  children,
}: OverlayShellProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Stays mounted for one extra tick after isOpen goes false so the
  // scale/fade-out animation has time to play instead of the panel just
  // vanishing — `open` toggles the entrance/exit animation class.
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [open, setOpen] = useState(isOpen);

  // Adjusting state during render (React's recommended pattern for this,
  // rather than an effect) so both the reopen and the start-of-close happen
  // on the same render as the prop change instead of a render-then-effect
  // round trip.
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }
  if (!isOpen && open) {
    setOpen(false);
  }

  useEffect(() => {
    if (isOpen) {
      // Next tick, so the initial mount paints in the "closed" state first
      // and the transition to "open" actually animates.
      const raf = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(raf);
    }

    const t = setTimeout(() => setShouldRender(false), EXIT_DURATION_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  const closeButton = (
    <button
      ref={closeRef}
      type="button"
      className={bare ? styles.closeBare : styles.close}
      onClick={onClose}
      aria-label="Close panel"
    >
      <svg
        className={styles.closeIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  );

  if (bare) {
    return (
      <div
        className={`${styles.backdrop} ${open ? styles.open : ""}`}
        onClick={onClose}
        role="presentation"
      >
        {closeButton}
        <div
          className={`${styles.barePanel} ${open ? styles.open : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.backdrop} ${open ? styles.open : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={[
          styles.modal,
          open ? styles.open : "",
          sizeClass[size],
          modalClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        {closeButton}
        {children}
      </div>
    </div>
  );
}
