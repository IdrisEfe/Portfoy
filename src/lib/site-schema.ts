import { z } from "zod";

const localizedIdentity = z.object({ descriptor: z.string().min(1).max(120), intro: z.string().min(1).max(500), heroFirst: z.string().min(1).max(120), heroSecond: z.string().min(1).max(120), cta: z.string().min(1).max(80) });
export const siteContentSchema = z.object({
  identity: z.object({ name: z.string().min(1).max(100), en: localizedIdentity, tr: localizedIdentity }),
  socials: z.array(z.object({ id: z.string().min(1).max(40), label: z.string().min(1).max(40), href: z.string().min(1).max(500), visible: z.boolean(), order: z.number().int().min(0).max(100) })).max(30),
  linkedinPosts: z.array(z.object({ id: z.string(), url: z.url(), title: z.string().max(200), excerpt: z.string().max(1500), publishedAt: z.string(), image: z.string(), taggedPeople: z.array(z.string().max(100)), sources: z.array(z.object({ label: z.string().max(120), url: z.url() })), visible: z.boolean() })).max(100),
  showcase: z.array(z.object({ id: z.string(), type: z.string(), title: z.string(), href: z.string(), visible: z.boolean() })).max(30),
  skills: z.array(z.object({ name: z.string().min(1).max(80), items: z.array(z.string().min(1).max(120)).max(30) })).max(20),
  journey: z.array(z.object({ year: z.string().min(1).max(30), title: z.string().min(1).max(150), body: z.string().max(800) })).max(100),
  resume: z.object({ url: z.string(), updatedAt: z.string(), visible: z.boolean() }),
  analytics: z.object({ publicMetrics: z.object({ totalVisits: z.boolean(), countries: z.boolean(), referrers: z.boolean(), popularPages: z.boolean(), projectClicks: z.boolean() }) }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
