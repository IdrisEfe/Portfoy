import rawSiteContent from "../../data/site-content.json";
import type { SiteContent } from "./site-schema";

export type Locale = "en" | "tr";
export const siteContent = rawSiteContent as SiteContent;

export const copy = {
  en: {
    nav: { home: "Home", work: "Work", lab: "Laboratory", now: "Now", skills: "Skills map", journey: "Journey", about: "About", contact: "Contact" },
    hero: [siteContent.identity.en.heroFirst, siteContent.identity.en.heroSecond],
    descriptor: siteContent.identity.en.descriptor,
    intro: siteContent.identity.en.intro,
    cta: siteContent.identity.en.cta,
    status: "Building the next useful thing",
    recent: "Recently in motion",
    selected: "Selected signals",
    availability: "Open to thoughtful collaborations",
  },
  tr: {
    nav: { home: "Ana sayfa", work: "İşler", lab: "Laboratuvar", now: "Şimdi", skills: "Yetenek haritası", journey: "Yolculuk", about: "Hakkımda", contact: "İletişim" },
    hero: [siteContent.identity.tr.heroFirst, siteContent.identity.tr.heroSecond],
    descriptor: siteContent.identity.tr.descriptor,
    intro: siteContent.identity.tr.intro,
    cta: siteContent.identity.tr.cta,
    status: "Sıradaki faydalı şeyi geliştiriyorum",
    recent: "Son hareketler",
    selected: "Seçili sinyaller",
    availability: "Özenli iş birliklerine açığım",
  },
} as const;

export const socials = siteContent.socials.filter((social) => social.visible).sort((a, b) => a.order - b.order);
export const socialsById = Object.fromEntries(siteContent.socials.map((social) => [social.id, social])) as Record<string, (typeof siteContent.socials)[number]>;

export const skills = siteContent.skills;
export const milestones = siteContent.journey;
