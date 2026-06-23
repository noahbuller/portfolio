"use client";

import { ReactNode, useEffect, useRef } from "react";
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

  if (!isOpen) return null;

  const closeButton = (
    <button
      ref={closeRef}
      type="button"
      className={bare ? styles.closeBare : styles.close}
      onClick={onClose}
      aria-label="Close panel"
    >
      ×
    </button>
  );

  if (bare) {
    return (
      <div className={styles.backdrop} onClick={onClose} role="presentation">
        {closeButton}
        <div
          className={styles.barePanel}
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
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={[styles.modal, sizeClass[size], modalClassName].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close panel"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
