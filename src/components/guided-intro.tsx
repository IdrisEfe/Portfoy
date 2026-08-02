"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSite } from "./site-provider";

const scenes = {
  en: [
    { kicker: "00 / hello", title: "You brought a reason.", body: "Maybe it is a product, an opportunity, or a question that refuses to stay theoretical." },
    { kicker: "01 / approach", title: "I learn by making.", body: "Fast enough to discover the truth. Carefully enough to make the result last." },
    { kicker: "02 / signal", title: "Choose a direction.", body: "No formality. Just tell the space what pulled you in." },
    { kicker: "03 / begin", title: "Good. Let’s start from here.", body: "The rest of the site is alive: current work, experiments, and the path behind them." },
  ],
  tr: [
    { kicker: "00 / merhaba", title: "Buraya bir nedenle geldin.", body: "Belki bir ürün, bir fırsat ya da teoride kalmayı reddeden bir soru." },
    { kicker: "01 / yaklaşım", title: "Yaparak öğreniyorum.", body: "Gerçeği bulacak kadar hızlı. Sonucu kalıcı kılacak kadar özenli." },
    { kicker: "02 / sinyal", title: "Bir yön seç.", body: "Resmiyete gerek yok. Seni buraya neyin çektiğini söyle." },
    { kicker: "03 / başlangıç", title: "Güzel. Eee, ne duruyoruz?", body: "Sitenin kalanı canlı: güncel işler, deneyler ve buraya uzanan yol." },
  ],
};

const intents = [
  { id: "business", en: "Build something", tr: "Bir şey inşa et", href: "/contact" },
  { id: "collab", en: "Collaborate", tr: "İş birliği yap", href: "/contact" },
  { id: "explore", en: "Explore", tr: "Keşfet", href: "/laboratory" },
  { id: "recruit", en: "See the work", tr: "İşlere bak", href: "/work" },
];

export function GuidedIntro({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useSite();
  const [scene, setScene] = useState(0);
  const [manual, setManual] = useState(false);
  const [destination, setDestination] = useState("/now");
  const router = useRouter();
  const content = scenes[locale];

  useEffect(() => {
    if (!open || manual) return;
    const timer = setInterval(() => setScene((current) => Math.min(current + 1, content.length - 1)), 7500);
    return () => clearInterval(timer);
  }, [open, manual, content.length]);

  if (!open) return null;
  const interact = () => setManual(true);
  const close = () => { setScene(0); setManual(false); setDestination("/now"); onClose(); };
  const finish = () => { const next = destination; close(); router.push(next); };

  return <div className="intro-overlay" role="dialog" aria-modal="true" aria-label="Guided introduction" onPointerDown={interact}>
    <button className="intro-close" onClick={close}><X size={18} /> <span>{locale === "en" ? "Skip" : "Geç"}</span></button>
    <div className="intro-progress">{content.map((_, index) => <span key={index} className={index <= scene ? "filled" : ""} />)}</div>
    <div className="intro-scene" key={scene}>
      <p className="eyebrow">{content[scene].kicker}</p>
      <h2>{content[scene].title}</h2>
      <p>{content[scene].body}</p>
      {scene === 2 && <div className="intent-grid">{intents.map((intent) => <button key={intent.id} onClick={() => { setDestination(intent.href); setScene(3); }}>{intent[locale]}</button>)}</div>}
    </div>
    <div className="intro-controls">
      <button disabled={scene === 0} onClick={() => { interact(); setScene((s) => Math.max(0, s - 1)); }}><ArrowLeft size={18} /></button>
      <span>{manual ? (locale === "en" ? "manual" : "manuel") : (locale === "en" ? "auto · interact to steer" : "otomatik · yönlendirmek için dokun")}</span>
      {scene < content.length - 1
        ? <button onClick={() => { interact(); setScene((s) => Math.min(content.length - 1, s + 1)); }}><ArrowRight size={18} /></button>
        : <button className="intro-enter" onClick={finish}>{locale === "en" ? "Enter" : "Gir"} <ArrowRight size={18} /></button>}
    </div>
  </div>;
}
