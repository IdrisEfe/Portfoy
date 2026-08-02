type Metric = { x: string; y: number };
type Stats = { pageviews: number | { value: number }; visitors: number | { value: number }; visits: number | { value: number } };

async function request(path: string) {
  const base = process.env.UMAMI_API_BASE_URL?.replace(/\/$/, ""); const key = process.env.UMAMI_API_KEY;
  if (!base || !key) throw new Error("Umami reporting is not configured.");
  const response = await fetch(`${base}${path}`, { headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }, next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`Umami reporting failed (${response.status}).`);
  return response.json();
}

export async function getPublicAnalytics(flags: { totalVisits: boolean; countries: boolean; referrers: boolean; popularPages: boolean; projectClicks: boolean }) {
  const websiteId = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID; if (!websiteId || !Object.values(flags).some(Boolean)) return null;
  const endAt = Date.now(); const startAt = endAt - 30 * 24 * 60 * 60 * 1000; const base = `/websites/${encodeURIComponent(websiteId)}`; const range = `startAt=${startAt}&endAt=${endAt}`;
  const output: { period: string; totalVisits?: number; countries?: Metric[]; referrers?: Metric[]; popularPages?: Metric[]; projectClicks?: number } = { period: "Last 30 days" };
  const tasks: Promise<void>[] = [];
  if (flags.totalVisits) tasks.push(request(`${base}/stats?${range}`).then((value: Stats) => { output.totalVisits = typeof value.visits === "number" ? value.visits : value.visits.value; }));
  const metrics = (type: string) => request(`${base}/metrics?${range}&type=${type}&limit=8`) as Promise<Metric[]>;
  if (flags.countries) tasks.push(metrics("country").then((value) => { output.countries = value.filter((item) => item.y >= 5).slice(0, 5); }));
  if (flags.referrers) tasks.push(metrics("referrer").then((value) => { output.referrers = value.filter((item) => item.y >= 5 && item.x).slice(0, 5); }));
  if (flags.popularPages) tasks.push(metrics("path").then((value) => { output.popularPages = value.filter((item) => item.y >= 5).slice(0, 5); }));
  if (flags.projectClicks) tasks.push(metrics("event").then((value) => { output.projectClicks = value.find((item) => item.x === "project-click")?.y || 0; }));
  await Promise.all(tasks); return output;
}
