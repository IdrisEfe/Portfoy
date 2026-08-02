import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { LabExperiments } from "@/components/lab-experiments";
export const metadata: Metadata = { title: "Project Laboratory" };
export default function LabPage() { return <div className="page-wrap"><PageHeading index="02" eyebrow={{ en: "LOAD ONLY WHAT YOU TOUCH", tr: "YALNIZCA DOKUNDUĞUNU YÜKLE" }} title={{ en: "A laboratory for useful mischief.", tr: "Faydalı yaramazlıklar için bir laboratuvar." }} body={{ en: "Original, small browser experiments. Each one stays dormant until you choose it—because play should not cost performance.", tr: "Tarayıcıda çalışan özgün, küçük deneyler. Sen seçene kadar hiçbiri yüklenmez; çünkü oyun performansa mal olmamalı." }} /><LabExperiments /></div>; }
