import type { Metadata } from "next";
import { PageHeading } from "@/components/page-heading";
import { DigitalMask } from "@/components/digital-mask";
import { siteContent } from "@/lib/content";
export const metadata: Metadata = { title: "About" };
export default function AboutPage() { return <div className="page-wrap"><PageHeading index="06" eyebrow="SELF-TAUGHT / ALWAYS IN MOTION" title={siteContent.identity.name} body="An ambitious builder interested in useful software, unusual interfaces, and learning quickly enough to turn possibility into something real." /><div className="about-grid"><DigitalMask compact /><div><h2>The short version</h2><p>I build by asking better questions, reducing ideas to working experiments, and following the strongest signal. This page grows into a full bilingual résumé as experience, education, and certificates are added through the owner dashboard.</p>{siteContent.resume.visible && siteContent.resume.url ? <a className="secondary-button" href={siteContent.resume.url} target="_blank" rel="noreferrer">Download résumé</a> : <span className="secondary-button disabled" aria-disabled="true">Résumé coming soon</span>}</div></div></div>; }
