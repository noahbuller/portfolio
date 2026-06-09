import { SubpageShell } from "@/components/layout/SubpageShell";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubpageShell current="projects">{children}</SubpageShell>;
}
