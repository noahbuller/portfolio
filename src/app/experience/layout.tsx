import { SubpageShell } from "@/components/layout/SubpageShell";

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubpageShell current="experience">{children}</SubpageShell>;
}
