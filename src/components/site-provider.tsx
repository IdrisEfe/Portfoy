"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { siteContent as fallbackContent, type Locale } from "@/lib/content";
import type { SiteContent } from "@/lib/site-schema";

type SiteContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  content: SiteContent;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [content, setContent] = useState<SiteContent>(fallbackContent);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const savedLocale = localStorage.getItem("iesy-locale") as Locale | null;
      const savedTheme = localStorage.getItem("iesy-theme") as "light" | "dark" | null;
      if (savedLocale === "en" || savedLocale === "tr") setLocaleState(savedLocale);
      if (savedTheme) setTheme(savedTheme);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let active = true;
    const refresh = () => { void fetch("/api/public/content", { cache: "no-store" }).then((response) => response.ok ? response.json() as Promise<SiteContent> : null).then((next) => { if (active && next) setContent(next); }).catch(() => undefined); };
    refresh();
    const published = () => refresh();
    addEventListener("iesy-content-published", published);
    addEventListener("storage", published);
    return () => { active = false; removeEventListener("iesy-content-published", published); removeEventListener("storage", published); };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
  }, [locale, theme]);

  const value = useMemo(() => ({
    locale,
    setLocale: (next: Locale) => { setLocaleState(next); localStorage.setItem("iesy-locale", next); },
    theme, content,
    toggleTheme: () => setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("iesy-theme", next);
      return next;
    }),
  }), [locale, theme, content]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside SiteProvider");
  return value;
}
