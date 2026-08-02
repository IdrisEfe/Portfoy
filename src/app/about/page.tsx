import type { Metadata } from "next";
import { AboutExperience } from "@/components/about-experience";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() { return <AboutExperience />; }
