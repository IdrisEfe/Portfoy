"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, Code2, Mail, Moon, Music2, Sun } from "lucide-react";
import { copy, socialsById } from "@/lib/content";
import { useSite } from "./site-provider";
import { AudioControl } from "./audio-control";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale, theme, toggleTheme } = useSite();
  const text = copy[locale];
  const links = [
    ["/", text.nav.home], ["/work", text.nav.work], ["/laboratory", text.nav.lab], ["/now", text.nav.now],
    ["/skills", text.nav.skills], ["/journey", text.nav.journey], ["/about", text.nav.about], ["/contact", text.nav.contact],
  ];

  return <>
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="iesy.me home"><span>i</span>esy.me</Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        {links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? "active" : ""}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="locale-switch" onClick={() => setLocale(locale === "en" ? "tr" : "en")} aria-label="Switch language">{locale === "en" ? "TR" : "EN"}</button>
        <AudioControl />
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle color theme">{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
      </div>
    </header>
    <main>{children}</main>
    <footer className="site-footer">
      <div><span className="pulse-dot" /> {text.availability}</div>
      <div className="footer-socials">
        {socialsById.github.visible && <a href={socialsById.github.href} target="_blank" rel="noreferrer" aria-label="GitHub"><Code2 size={17} /></a>}
        {socialsById.linkedin.visible && <a href={socialsById.linkedin.href} target="_blank" rel="noreferrer" aria-label="LinkedIn"><BriefcaseBusiness size={17} /></a>}
        {socialsById.spotify.visible && <a href={socialsById.spotify.href} target="_blank" rel="noreferrer" aria-label="Spotify"><Music2 size={17} /></a>}
        {socialsById.email.visible && <a href={socialsById.email.href} aria-label="Email"><Mail size={17} /></a>}
      </div>
      <span>© {new Date().getFullYear()} İdris Efe YEŞİLDAĞ</span>
    </footer>
  </>;
}
