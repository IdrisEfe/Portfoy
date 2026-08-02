import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { milestones } from "@/lib/content";
export const metadata: Metadata = { title: "Journey" };
export default function JourneyPage() { return <div className="page-wrap"><PageHeading index="05" eyebrow="THE PATH IS EDITABLE" title="No straight lines required." body="A career timeline will grow here from work, education, courses, certificates, experiments, and the milestones between them." /><div className="journey-line">{milestones.map((item) => <article key={item.year}><span>{item.year}</span><div><h2>{item.title}</h2><p>{item.body}</p></div></article>)}</div></div>; }
