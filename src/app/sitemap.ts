import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work", "/laboratory", "/now", "/skills", "/journey", "/about", "/contact"].map((path) => ({ url: `https://iesy.me${path}`, lastModified: new Date(), changeFrequency: path === "/now" || path === "/work" ? "weekly" : "monthly", priority: path === "" ? 1 : .8 }));
}
