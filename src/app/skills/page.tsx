import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { skills } from "@/lib/content";
export const metadata: Metadata = { title: "Skills Map" };
export default function SkillsPage() { return <div className="page-wrap"><PageHeading index="04" eyebrow="CAPABILITY IS A NETWORK" title="Not a progress-bar person." body="Skills are relationships between practice, curiosity, and shipped work—not arbitrary percentages." /><div className="skills-map">{skills.map((group, i) => <article key={group.name}><span>0{i + 1}</span><h2>{group.name}</h2>{group.items.map((item) => <p key={item}>{item}</p>)}</article>)}</div></div>; }
