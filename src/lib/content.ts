import rawSiteContent from "../../data/site-content.json";
import type { SiteContent } from "./site-schema";

export type Locale = "en" | "tr";
export const siteContent = rawSiteContent as SiteContent;

export function contentCopy(content: SiteContent) { return {
  en: {
    nav: { home: "Home", work: "Work", lab: "Laboratory", now: "Now", skills: "Skills map", journey: "Journey", about: "About", contact: "Contact" }, hero: [content.identity.en.heroFirst, content.identity.en.heroSecond], descriptor: content.identity.en.descriptor, intro: content.identity.en.intro, cta: content.identity.en.cta,
    status: "Building the next useful thing",
    recent: "Recently in motion",
    selected: "Selected signals",
    availability: "Open to thoughtful collaborations",
  },
  tr: {
    nav: { home: "Ana sayfa", work: "İşler", lab: "Laboratuvar", now: "Şimdi", skills: "Yetenek haritası", journey: "Yolculuk", about: "Hakkımda", contact: "İletişim" },
    hero: [content.identity.tr.heroFirst, content.identity.tr.heroSecond], descriptor: content.identity.tr.descriptor, intro: content.identity.tr.intro, cta: content.identity.tr.cta,
    status: "Sıradaki faydalı şeyi geliştiriyorum",
    recent: "Son hareketler",
    selected: "Seçili sinyaller",
    availability: "Özenli iş birliklerine açığım",
  },
} as const; }

export const copy = contentCopy(siteContent);

export const socials = siteContent.socials.filter((social) => social.visible).sort((a, b) => a.order - b.order);
export const socialsById = Object.fromEntries(siteContent.socials.map((social) => [social.id, social])) as Record<string, (typeof siteContent.socials)[number]>;

export const skills = siteContent.skills;
export const milestones = siteContent.journey;
