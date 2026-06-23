import { getProject } from "@/data/projects";

export type OverlayView =
  | null
  | "about"
  | "projects"
  | { type: "project"; slug: string }
  | "experience";

export function viewToHash(view: OverlayView): string {
  if (!view) return "";
  if (view === "about") return "#about";
  if (view === "projects") return "#projects";
  if (view === "experience") return "#experience";
  return `#projects/${view.slug}`;
}

export function hashToView(hash: string): OverlayView {
  const path = hash.replace(/^#/, "").replace(/\/$/, "");
  if (!path) return null;
  if (path === "about") return "about";
  if (path === "projects") return "projects";
  if (path === "experience") return "experience";
  if (path.startsWith("projects/")) {
    const slug = path.slice("projects/".length);
    if (slug && getProject(slug)) return { type: "project", slug };
    return "projects";
  }
  return null;
}

export function isProjectsView(view: OverlayView): boolean {
  return view === "projects" || (typeof view === "object" && view?.type === "project");
}
