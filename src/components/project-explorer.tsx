"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, GitFork, Search, Star } from "lucide-react";
import type { Repository } from "@/lib/github";
import { useSite } from "./site-provider";

export function ProjectExplorer({ repositories, compact = false }: { repositories: Repository[]; compact?: boolean }) {
  const { locale } = useSite();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"recent" | "stars" | "name">("recent");
  const visible = useMemo(() => repositories
    .filter((repo) => `${repo.name} ${repo.description ?? ""} ${repo.language ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "stars" ? b.stargazers_count - a.stargazers_count : sort === "name" ? a.name.localeCompare(b.name) : +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, compact ? 4 : undefined), [repositories, query, sort, compact]);

  return <div className="project-explorer">
    {!compact && <div className="project-tools">
      <label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "en" ? "Search repositories" : "Depolarda ara"} /></label>
      <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Sort projects">
        <option value="recent">{locale === "en" ? "Recently pushed" : "Son güncellenen"}</option><option value="stars">{locale === "en" ? "Most starred" : "En çok yıldız"}</option><option value="name">{locale === "en" ? "Name" : "Ad"}</option>
      </select>
    </div>}
    <div className="project-grid">
      {visible.map((repo, index) => <a className="project-card" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id} style={{ "--index": index } as React.CSSProperties} data-umami-event="project-click" data-umami-event-project={repo.name}>
        <div className="project-top"><span>{repo.fork ? "FORK" : repo.language ?? "PROJECT"}</span><ArrowUpRight size={18} /></div>
        <h3>{repo.name.replaceAll("_", " ")}</h3>
        <p>{repo.description || (locale === "en" ? "An active repository in the making." : "Geliştirilmekte olan aktif bir depo.")}</p>
        <div className="project-meta"><span><Star size={14} /> {repo.stargazers_count}</span><span><GitFork size={14} /> {repo.forks_count}</span><span>{new Date(repo.pushed_at).toLocaleDateString("en", { month: "short", year: "numeric" })}</span></div>
      </a>)}
    </div>
  </div>;
}
