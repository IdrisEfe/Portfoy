"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { copy, siteContent, socialsById } from "@/lib/content";
import type { Repository } from "@/lib/github";
import { useSite } from "./site-provider";
import { DigitalMask } from "./digital-mask";
import { GuidedIntro } from "./guided-intro";
import { ProjectExplorer } from "./project-explorer";
import { PublicMetrics } from "./public-metrics";

export function HomeExperience({ repositories }: { repositories: Repository[] }) {
  const { locale } = useSite();
  const text = copy[locale];
  const [intro, setIntro] = useState(false);
  return <>
    <section className="hero section-grid">
      <div className="hero-noise" />
      <div className="hero-copy">
        <p className="eyebrow"><span className="pulse-dot" /> {text.status}</p>
        <h1><span>{text.hero[0]}</span><span className="accent-line">{text.hero[1]}</span></h1>
        <p className="hero-intro">{text.intro}</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => setIntro(true)}>{text.cta} <ArrowRight size={18} /></button>
          <div className="social-row">
            {socialsById.github.visible && <a href={socialsById.github.href} target="_blank" rel="noreferrer" aria-label="GitHub"><Code2 size={19} /></a>}
            {socialsById.linkedin.visible && <a href={socialsById.linkedin.href} target="_blank" rel="noreferrer" aria-label="LinkedIn"><BriefcaseBusiness size={19} /></a>}
            {socialsById.email.visible && <a href={socialsById.email.href} aria-label="Email"><Mail size={19} /></a>}
          </div>
        </div>
      </div>
      <div className="hero-mask"><DigitalMask mode={siteContent.avatar.mode} /><div className="mask-label top">IDENTITY / 3D</div><div className="mask-label bottom">MOVE TO REORIENT · TAP TO PULSE</div></div>
      <a href="#signals" className="scroll-cue"><ArrowDown size={17} /> SCROLL TO SIGNALS</a>
    </section>
    <section className="signal-strip"><span>01</span><p>{text.descriptor}</p><span>IST · UTC+3</span><span>AVAILABLE / SELECTIVELY</span></section>
    <section id="signals" className="content-section">
      <div className="section-heading"><div><p className="eyebrow">GITHUB / LIVE DATA</p><h2>{text.recent}</h2></div><Link href="/work">Open the full archive <ArrowRight size={17} /></Link></div>
      <ProjectExplorer repositories={repositories} compact />
    </section>
    <section className="split-feature content-section">
      <div><p className="eyebrow">CURRENT FREQUENCY</p><h2>Learning, building,<br />leaving a trail.</h2></div>
      <div className="feature-list">
        {siteContent.showcase.filter((item) => item.visible).map((item, index) => <Link href={item.href} key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><p>{item.type === "project" ? "A selected project signal." : "A different way into the work."}</p></div><ArrowRight /></Link>)}
      </div>
    </section>
    <PublicMetrics />
    <GuidedIntro open={intro} onClose={() => setIntro(false)} />
  </>;
}
