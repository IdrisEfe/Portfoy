import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { DigitalMask } from "@/components/digital-mask";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() { return <div className="page-wrap"><PageHeading index="06" eyebrow="SELF-TAUGHT / ALWAYS IN MOTION" title="İdris Efe YEŞİLDAĞ" body="An ambitious builder interested in useful software, unusual interfaces, and learning quickly enough to turn possibility into something real." /><div className="about-grid"><DigitalMask compact /><div><h2>The short version</h2><p>I build by asking better questions, reducing ideas to working experiments, and following the strongest signal. This page will grow into a full bilingual résumé as experience, education, and certificates are added through the admin system.</p><a className="secondary-button disabled" aria-disabled="true">Résumé coming soon</a></div></div></div>; }
