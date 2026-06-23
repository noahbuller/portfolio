"use client";

import { ReactNode, useEffect, useRef } from "react";
import styles from "./OverlayShell.module.css";

export type OverlaySize = "compact" | "wide" | "full";

interface OverlayShellProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  size?: OverlaySize;
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

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={[styles.modal, sizeClass[size]].filter(Boolean).join(" ")}
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
