import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { LabExperiments } from "@/components/lab-experiments";
export const metadata: Metadata = { title: "Project Laboratory" };
export default function LabPage() { return <div className="page-wrap"><PageHeading index="02" eyebrow="LOAD ONLY WHAT YOU TOUCH" title="A laboratory for useful mischief." body="Original, small browser experiments. Each one stays dormant until you choose it—because play should not cost performance." /><LabExperiments /></div>; }
