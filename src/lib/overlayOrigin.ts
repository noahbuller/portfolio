/**
 * Remembers which element the visitor last pressed (a billboard, a nav link,
 * a plane banner, a button inside another overlay) so an opening overlay can
 * grow out of it and shrink back into it on close.
 *
 * Tracked at the document level instead of threading an element through
 * every openX() call — openers stay plain `onClick={openAbout}` handlers.
 */

// How long after a press it still counts as "what opened this overlay".
// Covers the click → hash push → render path; a keyboard shortcut or
// browser Back long after the last press falls back to a plain fade.
const ORIGIN_TTL_MS = 1000;

let lastPress: { el: Element; at: number } | null = null;

function onPointerDown(e: PointerEvent) {
  const target = e.target instanceof Element ? e.target : null;
  const el = target?.closest("button, a");
  lastPress = el ? { el, at: performance.now() } : null;
}

/** Installs the press listener; returns its cleanup. */
export function trackOverlayOrigin() {
  document.addEventListener("pointerdown", onPointerDown, true);
  return () => document.removeEventListener("pointerdown", onPointerDown, true);
}

/** The element pressed just before this overlay opened, if any. */
export function takeOverlayOrigin(): Element | null {
  if (!lastPress || performance.now() - lastPress.at > ORIGIN_TTL_MS) {
    return null;
  }
  return lastPress.el;
}

/** Viewport rect of `el` if it's still mounted and at least partly on screen. */
export function visibleRect(el: Element | null): DOMRect | null {
  if (!el || !el.isConnected) return null;
  const rect = el.getBoundingClientRect();
  const onScreen =
    rect.width > 0 &&
    rect.height > 0 &&
    rect.right > 0 &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.top < window.innerHeight;
  return onScreen ? rect : null;
}
