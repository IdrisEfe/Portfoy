import { revalidatePath } from "next/cache";
import { siteContentSchema, type SiteContent } from "./site-schema";
import type { AdminSession } from "./admin-session";
import rawSiteContent from "../../data/site-content.json";

const configuredBranch = () => process.env.GITHUB_CONTENT_BRANCH || "content";
type GitHubHeaders = Record<string, string>;

async function ensureGitHubBranch(owner: string, repo: string, branch: string, headers: GitHubHeaders) {
  const api = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const branchRef = await fetch(`${api}/git/ref/heads/${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  if (branchRef.ok) return;
  if (branchRef.status !== 404) throw new Error(`Could not inspect the GitHub content branch (${branchRef.status}).`);
  const repositoryResponse = await fetch(api, { headers, cache: "no-store" });
  if (!repositoryResponse.ok) throw new Error(`Could not inspect the GitHub repository (${repositoryResponse.status}).`);
  const repository = await repositoryResponse.json() as { default_branch?: string };
  const baseBranch = repository.default_branch || "main";
  const baseResponse = await fetch(`${api}/git/ref/heads/${encodeURIComponent(baseBranch)}`, { headers, cache: "no-store" });
  if (!baseResponse.ok) throw new Error(`Could not inspect GitHub's ${baseBranch} branch (${baseResponse.status}).`);
  const base = await baseResponse.json() as { object?: { sha?: string } };
  if (!base.object?.sha) throw new Error("GitHub did not return a base commit for the content branch.");
  const createResponse = await fetch(`${api}/git/refs`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: base.object.sha }) });
  if (!createResponse.ok && createResponse.status !== 422) throw new Error(`Could not create the GitHub content branch (${createResponse.status}).`);
}

async function readLocalSiteContent(): Promise<SiteContent> {
  return siteContentSchema.parse(rawSiteContent);
}

async function writeLocalContent(content: SiteContent) {
  const [{ writeFile }, path] = await Promise.all([import("node:fs/promises"), import("node:path")]);
  await writeFile(path.join(process.cwd(), "data", "site-content.json"), `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

async function readGitHubSiteContent(): Promise<SiteContent | null> {
  const owner = process.env.GITHUB_CONTENT_OWNER; const repo = process.env.GITHUB_CONTENT_REPO; const branch = configuredBranch();
  if (!owner || !repo) return null;
  const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/data/site-content.json?ref=${encodeURIComponent(branch)}`;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const response = await fetch(endpoint, { headers, cache: "no-store" });
    if (!response.ok) return null;
    const result = await response.json() as { content?: string; encoding?: string };
    if (!result.content || result.encoding !== "base64") return null;
    return siteContentSchema.parse(JSON.parse(Buffer.from(result.content.replace(/\n/g, ""), "base64").toString("utf8")));
  } catch { return null; }
}

export async function readSiteContent(): Promise<SiteContent> {
  return await readGitHubSiteContent() || readLocalSiteContent();
}

async function publishToGitHub(content: SiteContent, session: AdminSession) {
  const owner = process.env.GITHUB_CONTENT_OWNER; const repo = process.env.GITHUB_CONTENT_REPO; const branch = configuredBranch();
  const token = session.accessToken || process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) return false;
  const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/data/site-content.json`;
  const headers: GitHubHeaders = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  await ensureGitHubBranch(owner, repo, branch, headers);
  const current = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, { headers, cache: "no-store" });
  const existing = current.ok ? await current.json() as { sha?: string } : {};
  const response = await fetch(endpoint, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ message: "content: publish portfolio updates", content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`).toString("base64"), branch, sha: existing.sha }) });
  if (!response.ok) throw new Error(`GitHub publishing failed (${response.status}).`);
  return branch;
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
    await writeLocalContent(publicContent);
  }
  revalidatePath("/", "layout");
  return { content: publicContent, destination: publishedToGitHub ? `github/${publishedToGitHub}` : "local" };
}

export async function uploadAdminAsset(file: File, session: AdminSession) {
  const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Only PDF, PNG, JPEG, or WebP files up to 5 MB are allowed.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-"); const stamp = Date.now(); const relative = `uploads/${stamp}-${safeName}`; const bytes = Buffer.from(await file.arrayBuffer());
  const owner = process.env.GITHUB_CONTENT_OWNER; const repo = process.env.GITHUB_CONTENT_REPO; const branch = configuredBranch(); const token = session.accessToken || process.env.GITHUB_TOKEN;
  if (owner && repo && token) {
    const headers: GitHubHeaders = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    await ensureGitHubBranch(owner, repo, branch, headers);
    const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/public/${relative}`;
    const response = await fetch(endpoint, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ message: `content: upload ${safeName}`, content: bytes.toString("base64"), branch }) });
    if (!response.ok) throw new Error(`GitHub upload failed (${response.status}).`);
    return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/public/${relative.split("/").map(encodeURIComponent).join("/")}`;
  }
  if (process.env.NODE_ENV === "production") throw new Error("GitHub asset publishing is not configured.");
  const [{ mkdir, writeFile }, path] = await Promise.all([import("node:fs/promises"), import("node:path")]);
  const destination = path.join(process.cwd(), "public", "uploads"); await mkdir(destination, { recursive: true }); await writeFile(path.join(destination, `${stamp}-${safeName}`), bytes);
  return `/${relative}`;
}
