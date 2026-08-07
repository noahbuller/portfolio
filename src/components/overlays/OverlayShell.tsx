"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
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

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dragStartY = useRef<number | null>(null);
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

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    triggerRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      // Keep Tab/Shift+Tab cycling inside the modal instead of escaping
      // into the page behind it, which is still visible but shouldn't be
      // reachable while the overlay is up.
      const container = containerRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // Return focus to whatever opened this overlay so keyboard users
      // don't lose their place in the page.
      triggerRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  // Swipe-down-to-close on the mobile bottom-sheet layout (see the
  // dragHandle — hidden above 600px) — the sheet's rounded top corners
  // already read as a native bottom sheet, so a swipe is the gesture users
  // will instinctively try.
  const onDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const onDragMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null || !panelRef.current) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta > 0) {
      panelRef.current.style.transform = `translateY(${delta}px)`;
    }
  };

  const onDragEnd = (e: React.TouchEvent) => {
    if (dragStartY.current === null || !panelRef.current) return;
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    dragStartY.current = null;
    panelRef.current.style.transform = "";
    if (delta > 70) onClose();
  };

  const dragHandle = (
    <div
      className={styles.dragHandle}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}
      aria-hidden="true"
    />
  );

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

  // These panels are always-mounted siblings (About/Projects/Experience),
  // so switching directly between two overlays briefly keeps both mounted
  // during the exit animation. `inert` pulls the closing one out of hit
  // testing and the a11y/focus tree immediately, instead of leaving its
  // controls tabbable/clickable underneath the one opening on top of it.
  const inert = !isOpen || undefined;

  if (bare) {
    return (
      <div
        ref={containerRef}
        className={`${styles.backdrop} ${open ? styles.open : ""}`}
        onClick={onClose}
        role="presentation"
        inert={inert}
      >
        {closeButton}
        <div
          ref={panelRef}
          className={`${styles.barePanel} ${open ? styles.open : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
        >
          {dragHandle}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.backdrop} ${open ? styles.open : ""}`}
      onClick={onClose}
      role="presentation"
      inert={inert}
    >
      <div
        ref={panelRef}
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
        {dragHandle}
        {closeButton}
        {children}
      </div>
    </div>
  );
}
