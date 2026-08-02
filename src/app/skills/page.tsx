import type { Metadata } from "next";
import { SkillsExperience } from "@/components/skills-experience";
export const metadata: Metadata = { title: "Skills Map" };
export default function SkillsPage() { return <SkillsExperience />; }
