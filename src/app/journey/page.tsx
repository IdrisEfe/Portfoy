import type { Metadata } from "next";
import { JourneyExperience } from "@/components/journey-experience";
export const metadata: Metadata = { title: "Journey" };
export default function JourneyPage() { return <JourneyExperience />; }
