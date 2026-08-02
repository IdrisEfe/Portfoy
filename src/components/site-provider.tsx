"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/content";

type SiteContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

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
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
  }, [locale, theme]);

  const value = useMemo(() => ({
    locale,
    setLocale: (next: Locale) => { setLocaleState(next); localStorage.setItem("iesy-locale", next); },
    theme,
    toggleTheme: () => setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem("iesy-theme", next);
      return next;
    }),
  }), [locale, theme]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside SiteProvider");
  return value;
}
