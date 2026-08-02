"use client";
import { useEffect, useState } from "react";
type Metric = { x: string; y: number }; type Data = { period: string; totalVisits?: number; countries?: Metric[]; referrers?: Metric[]; popularPages?: Metric[]; projectClicks?: number };
export function PublicMetrics() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => { const controller = new AbortController(); fetch("/api/public/analytics", { signal: controller.signal }).then((response) => response.ok && response.status !== 204 ? response.json() : null).then(setData).catch(() => undefined); return () => controller.abort(); }, []);
  if (!data) return null;
  const lists = [["Top countries", data.countries], ["Referrers", data.referrers], ["Popular pages", data.popularPages]] as const;
  return <section className="public-metrics content-section"><div><p className="eyebrow">PUBLIC SIGNAL / {data.period}</p><h2>Some numbers<br />can be human.</h2></div><div className="metric-cards">{data.totalVisits !== undefined && <article><strong>{data.totalVisits.toLocaleString()}</strong><span>visits</span></article>}{data.projectClicks !== undefined && <article><strong>{data.projectClicks.toLocaleString()}</strong><span>project clicks</span></article>}{lists.map(([label, items]) => items?.length ? <article key={label}><span>{label}</span>{items.map((item) => <p key={item.x}>{item.x}<b>{item.y}</b></p>)}</article> : null)}</div></section>;
}
