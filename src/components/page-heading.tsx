"use client";
import { useSite } from "./site-provider";

type Localized = string | { en: string; tr: string };
const valueFor = (value: Localized, locale: "en" | "tr") => typeof value === "string" ? value : value[locale];

export function PageHeading({ index, eyebrow, title, body }: { index: string; eyebrow: Localized; title: Localized; body: Localized }) {
  const { locale } = useSite();
  return <header className="page-heading"><span>{index}</span><div><p className="eyebrow">{valueFor(eyebrow, locale)}</p><h1>{valueFor(title, locale)}</h1><p>{valueFor(body, locale)}</p></div></header>;
}
