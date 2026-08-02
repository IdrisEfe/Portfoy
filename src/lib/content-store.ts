import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { siteContentSchema, type SiteContent } from "./site-schema";
import type { AdminSession } from "./admin-session";

const contentPath = path.join(process.cwd(), "data", "site-content.json");

export async function readSiteContent(): Promise<SiteContent> {
  return siteContentSchema.parse(JSON.parse(await readFile(contentPath, "utf8")));
}

async function publishToGitHub(content: SiteContent, session: AdminSession) {
  const owner = process.env.GITHUB_CONTENT_OWNER; const repo = process.env.GITHUB_CONTENT_REPO; const branch = process.env.GITHUB_CONTENT_BRANCH || "main";
  const token = session.accessToken || process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) return false;
  const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/data/site-content.json`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  const current = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  const existing = current.ok ? await current.json() as { sha?: string } : {};
  const response = await fetch(endpoint, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ message: "content: publish portfolio updates", content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`).toString("base64"), branch, sha: existing.sha }) });
  if (!response.ok) throw new Error(`GitHub publishing failed (${response.status}).`);
  return true;
}

export async function publishSiteContent(input: unknown, session: AdminSession) {
  const content = siteContentSchema.parse(input);
  const publicContent: SiteContent = {
    ...content,
    socials: content.socials.filter((item) => item.visible),
    linkedinPosts: content.linkedinPosts.filter((item) => item.visible),
    showcase: content.showcase.filter((item) => item.visible),
    resume: content.resume.visible ? content.resume : { url: "", updatedAt: "", visible: false },
  };
  const publishedToGitHub = await publishToGitHub(publicContent, session);
  if (!publishedToGitHub) {
    if (process.env.NODE_ENV === "production") throw new Error("GitHub content publishing is not configured.");
    await writeFile(contentPath, `${JSON.stringify(publicContent, null, 2)}\n`, "utf8");
  }
  revalidatePath("/", "layout");
  return { content: publicContent, destination: publishedToGitHub ? "github" : "local" };
}

export async function uploadAdminAsset(file: File, session: AdminSession) {
  const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Only PDF, PNG, JPEG, or WebP files up to 5 MB are allowed.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-"); const stamp = Date.now(); const relative = `uploads/${stamp}-${safeName}`; const bytes = Buffer.from(await file.arrayBuffer());
  const owner = process.env.GITHUB_CONTENT_OWNER; const repo = process.env.GITHUB_CONTENT_REPO; const branch = process.env.GITHUB_CONTENT_BRANCH || "main"; const token = session.accessToken || process.env.GITHUB_TOKEN;
  if (owner && repo && token) {
    const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/public/${relative}`;
    const response = await fetch(endpoint, { method: "PUT", headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" }, body: JSON.stringify({ message: `content: upload ${safeName}`, content: bytes.toString("base64"), branch }) });
    if (!response.ok) throw new Error(`GitHub upload failed (${response.status}).`);
    return `/${relative}`;
  }
  if (process.env.NODE_ENV === "production") throw new Error("GitHub asset publishing is not configured.");
  const destination = path.join(process.cwd(), "public", "uploads"); await mkdir(destination, { recursive: true }); await writeFile(path.join(destination, `${stamp}-${safeName}`), bytes);
  return `/${relative}`;
}
