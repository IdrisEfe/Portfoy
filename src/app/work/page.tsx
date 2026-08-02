import type { Metadata } from "next";
import { getRepositories } from "@/lib/github";
import { PageHeading } from "@/components/page-heading";
import { ProjectExplorer } from "@/components/project-explorer";
export const metadata: Metadata = { title: "Work" };
export default async function WorkPage() { const repositories = await getRepositories(); return <div className="page-wrap"><PageHeading index="01" eyebrow="PUBLIC REPOSITORIES / CURATED SIGNAL" title="Work, without the museum glass." body="Recent repositories and selected projects share the same surface. Search the whole public trail; the strongest signals rise first." /><ProjectExplorer repositories={repositories} /></div>; }
