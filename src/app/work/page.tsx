import type { Metadata } from "next";
import { getRepositories } from "@/lib/github";
import { PageHeading } from "@/components/page-heading";
import { ProjectExplorer } from "@/components/project-explorer";
export const metadata: Metadata = { title: "Work" };
export default async function WorkPage() { const repositories = await getRepositories(); return <div className="page-wrap"><PageHeading index="01" eyebrow={{ en: "PUBLIC REPOSITORIES / CURATED SIGNAL", tr: "AÇIK DEPOLAR / SEÇİLMİŞ SİNYAL" }} title={{ en: "Work, without the museum glass.", tr: "Müze camının arkasında olmayan işler." }} body={{ en: "Recent repositories and selected projects share the same surface. Search the whole public trail; the strongest signals rise first.", tr: "Güncel depolar ve seçilmiş projeler aynı yüzeyde buluşuyor. Açık izlerin tamamını ara; en güçlü sinyaller öne çıksın." }} /><ProjectExplorer repositories={repositories} /></div>; }
