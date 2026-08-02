"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, Check, Eye, FileText, Layers3, Link2, LoaderCircle, LogIn, Plus, Save, Send, Trash2, UserRound } from "lucide-react";
import type { SiteContent } from "@/lib/site-schema";

type State = { loading: boolean; authenticated: boolean; user?: string; content?: SiteContent; error?: string };
type Tab = "identity" | "sections" | "socials" | "linkedin" | "resume" | "analytics";

export function AdminDashboard() {
  const [state, setState] = useState<State>({ loading: true, authenticated: false });
  const [tab, setTab] = useState<Tab>("identity");
  const [preview, setPreview] = useState(false);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (!response.ok) { setState({ loading: false, authenticated: false }); return; }
    const result = await response.json() as { authenticated: boolean; user: string; content: SiteContent };
    const draft = localStorage.getItem("iesy-admin-draft");
    setState({ loading: false, authenticated: true, user: result.user, content: draft ? JSON.parse(draft) as SiteContent : result.content });
  }, []);
  useEffect(() => { const frame = requestAnimationFrame(() => { void load(); }); return () => cancelAnimationFrame(frame); }, [load]);
  const update = (content: SiteContent) => setState((current) => ({ ...current, content }));
  const saveDraft = () => { if (!state.content) return; localStorage.setItem("iesy-admin-draft", JSON.stringify(state.content)); setNotice("Draft saved in this browser."); };
  const publish = async () => {
    if (!state.content) return; setNotice("Publishing…");
    const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state.content) });
    const result = await response.json() as { error?: string; destination?: string };
    if (!response.ok) { setNotice(result.error || "Publishing failed."); return; }
    localStorage.setItem("iesy-admin-draft", JSON.stringify(state.content)); localStorage.setItem("iesy-content-version", String(Date.now())); dispatchEvent(new Event("iesy-content-published")); setNotice(`Published visible content to ${result.destination}. Public pages now read the latest published version; your fuller draft remains in this browser.`);
  };
  if (state.loading) return <div className="admin-gate"><LoaderCircle className="spin" /><p>Checking the door…</p></div>;
  if (!state.authenticated || !state.content) return <div className="admin-gate"><p className="eyebrow">OWNER ACCESS ONLY</p><h1>The control room is locked.</h1><p>Configure the GitHub OAuth environment variables, then sign in with the approved owner account.</p><a className="primary-button" href="/api/auth/github"><LogIn size={18} /> Continue with GitHub</a><code>For local-only setup: ADMIN_DEV_BYPASS=true</code></div>;
  const content = state.content;
  const tabs: { id: Tab; label: string; icon: typeof UserRound }[] = [
    { id: "identity", label: "Identity", icon: UserRound }, { id: "sections", label: "Sections", icon: Layers3 }, { id: "socials", label: "Socials", icon: Link2 }, { id: "linkedin", label: "LinkedIn", icon: Send }, { id: "resume", label: "Résumé", icon: FileText }, { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];
  return <>
    <header className="admin-header"><div><p className="eyebrow">CONTROL ROOM / {state.user}</p><h1>Shape the signal.</h1></div><div className="admin-actions"><button onClick={saveDraft}><Save size={17} /> Save draft</button><button onClick={() => setPreview((value) => !value)}><Eye size={17} /> Preview</button><button className="publish" onClick={publish}><Check size={17} /> Publish</button><form action="/api/auth/logout" method="post"><button>Log out</button></form></div></header>
    {notice && <div className="admin-notice">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    <div className="admin-layout"><nav>{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><Icon size={17} /> {label}</button>)}</nav><section className="admin-panel">
      {preview ? <Preview content={content} /> : <>
        {tab === "identity" && <IdentityEditor content={content} update={update} />}
        {tab === "sections" && <SectionsEditor content={content} update={update} />}
        {tab === "socials" && <SocialEditor content={content} update={update} />}
        {tab === "linkedin" && <LinkedInEditor content={content} update={update} />}
        {tab === "resume" && <ResumeEditor content={content} update={update} setNotice={setNotice} />}
        {tab === "analytics" && <AnalyticsEditor content={content} update={update} />}
      </>}
    </section></div>
  </>;
}

function SectionsEditor({ content, update }: EditorProps) {
  return <div className="widget-stack"><Widget title="Homepage showcase" description="These are the default mixed signals when no project override is configured.">{content.showcase.map((item, index) => <div className="admin-row" key={item.id}><label>Title<input value={item.title} onChange={(e) => update({ ...content, showcase: content.showcase.map((entry, i) => i === index ? { ...entry, title: e.target.value } : entry) })} /></label><label>Destination<input value={item.href} onChange={(e) => update({ ...content, showcase: content.showcase.map((entry, i) => i === index ? { ...entry, href: e.target.value } : entry) })} /></label><label className="check"><input type="checkbox" checked={item.visible} onChange={(e) => update({ ...content, showcase: content.showcase.map((entry, i) => i === index ? { ...entry, visible: e.target.checked } : entry) })} /> Visible</label></div>)}</Widget><Widget title="Skills map" description="Edit capability groups without inventing percentage scores.">{content.skills.map((group, index) => <div className="post-editor" key={`${group.name}-${index}`}><label>Group<input value={group.name} onChange={(e) => update({ ...content, skills: content.skills.map((entry, i) => i === index ? { ...entry, name: e.target.value } : entry) })} /></label><label>Skills (comma-separated)<textarea value={group.items.join(", ")} onChange={(e) => update({ ...content, skills: content.skills.map((entry, i) => i === index ? { ...entry, items: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) } : entry) })} /></label></div>)}</Widget><Widget title="Journey" description="Work, education, courses, certificates, and milestones can all become entries.">{content.journey.map((entry, index) => <div className="post-editor" key={`${entry.year}-${index}`}><div className="admin-row"><label>When<input value={entry.year} onChange={(e) => update({ ...content, journey: content.journey.map((item, i) => i === index ? { ...item, year: e.target.value } : item) })} /></label><label>Title<input value={entry.title} onChange={(e) => update({ ...content, journey: content.journey.map((item, i) => i === index ? { ...item, title: e.target.value } : item) })} /></label><button className="danger" onClick={() => update({ ...content, journey: content.journey.filter((_, i) => i !== index) })}><Trash2 size={17} /></button></div><label>Story<textarea rows={3} value={entry.body} onChange={(e) => update({ ...content, journey: content.journey.map((item, i) => i === index ? { ...item, body: e.target.value } : item) })} /></label></div>)}<button className="admin-add" onClick={() => update({ ...content, journey: [...content.journey, { year: "New", title: "New milestone", body: "" }] })}><Plus size={17} /> Add milestone</button></Widget></div>;
}

function IdentityEditor({ content, update }: EditorProps) {
  const setIdentity = (locale: "en" | "tr", key: keyof SiteContent["identity"]["en"], value: string) => update({ ...content, identity: { ...content.identity, [locale]: { ...content.identity[locale], [key]: value } } });
  return <Widget title="Identity and voice" description="English and Turkish are authored independently."><div className="admin-row"><label>Display name<input value={content.identity.name} onChange={(e) => update({ ...content, identity: { ...content.identity, name: e.target.value } })} /></label><label>Interactive identity<select value={content.avatar.mode} onChange={(e) => update({ ...content, avatar: { mode: e.target.value as SiteContent["avatar"]["mode"] } })}><option value="face">3D point-cloud face</option><option value="mask">Transforming digital mask</option></select></label></div><div className="admin-columns">{(["en", "tr"] as const).map((locale) => <div key={locale}><p className="eyebrow">{locale === "en" ? "ENGLISH" : "TÜRKÇE"}</p>{(["descriptor", "heroFirst", "heroSecond", "intro", "cta"] as const).map((key) => <label key={key}>{key}<textarea rows={key === "intro" ? 3 : 1} value={content.identity[locale][key]} onChange={(e) => setIdentity(locale, key, e.target.value)} /></label>)}</div>)}</div></Widget>;
}

function SocialEditor({ content, update }: EditorProps) {
  const patchSocial = (index: number, patch: Partial<SiteContent["socials"][number]>) => update({ ...content, socials: content.socials.map((social, i) => i === index ? { ...social, ...patch } : social) });
  const remove = (index: number) => update({ ...content, socials: content.socials.filter((_, i) => i !== index) });
  return <Widget title="Social accounts" description="Reorder numerically, hide temporarily, or remove entirely.">{content.socials.map((social, index) => <div className="admin-row" key={`${social.id}-${index}`}><label>Label<input value={social.label} onChange={(e) => patchSocial(index, { label: e.target.value })} /></label><label>URL<input value={social.href} onChange={(e) => patchSocial(index, { href: e.target.value })} /></label><label>Order<input type="number" value={social.order} onChange={(e) => patchSocial(index, { order: Number(e.target.value) })} /></label><label className="check"><input type="checkbox" checked={social.visible} onChange={(e) => patchSocial(index, { visible: e.target.checked })} /> Visible</label><button className="danger" onClick={() => remove(index)} aria-label={`Remove ${social.label}`}><Trash2 size={17} /></button></div>)}<button className="admin-add" onClick={() => update({ ...content, socials: [...content.socials, { id: crypto.randomUUID(), label: "New link", href: "https://", visible: false, order: content.socials.length + 1 }] })}><Plus size={17} /> Add account</button></Widget>;
}

function LinkedInEditor({ content, update }: EditorProps) {
  const add = () => update({ ...content, linkedinPosts: [{ id: crypto.randomUUID(), url: "https://www.linkedin.com/posts/", title: "", excerpt: "", publishedAt: new Date().toISOString().slice(0, 10), image: "", taggedPeople: [], sources: [], visible: false }, ...content.linkedinPosts] });
  const patchPost = (index: number, patch: Partial<SiteContent["linkedinPosts"][number]>) => update({ ...content, linkedinPosts: content.linkedinPosts.map((post, i) => i === index ? { ...post, ...patch } : post) });
  return <Widget title="LinkedIn post ingestion" description="Paste the original URL, confirm the presentation manually, then publish. The site never scrapes LinkedIn."><button className="admin-add" onClick={add}><Plus size={17} /> Add post URL</button>{content.linkedinPosts.map((post, index) => <article className="post-editor" key={post.id}><div className="admin-row"><label>Original URL<input value={post.url} onChange={(e) => patchPost(index, { url: e.target.value })} /></label><label>Date<input type="date" value={post.publishedAt} onChange={(e) => patchPost(index, { publishedAt: e.target.value })} /></label><label className="check"><input type="checkbox" checked={post.visible} onChange={(e) => patchPost(index, { visible: e.target.checked })} /> Visible</label><button className="danger" onClick={() => update({ ...content, linkedinPosts: content.linkedinPosts.filter((_, i) => i !== index) })}><Trash2 size={17} /></button></div><label>Title<input value={post.title} onChange={(e) => patchPost(index, { title: e.target.value })} /></label><label>Excerpt<textarea rows={4} value={post.excerpt} onChange={(e) => patchPost(index, { excerpt: e.target.value })} /></label><label>Image URL<input value={post.image} onChange={(e) => patchPost(index, { image: e.target.value })} /></label><label>Tagged people (comma-separated)<input value={post.taggedPeople.join(", ")} onChange={(e) => patchPost(index, { taggedPeople: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label><label>Sources (one “label | URL” per line)<textarea rows={3} value={post.sources.map((source) => `${source.label} | ${source.url}`).join("\n")} onChange={(e) => patchPost(index, { sources: e.target.value.split("\n").map((line) => { const [label, url] = line.split("|").map((value) => value.trim()); return { label: label || url, url }; }).filter((source) => source.url?.startsWith("http")) })} /></label></article>)}</Widget>;
}

function ResumeEditor({ content, update, setNotice }: EditorProps & { setNotice: (value: string) => void }) {
  const upload = async (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; setNotice("Uploading…"); const data = new FormData(); data.set("file", file); const response = await fetch("/api/admin/upload", { method: "POST", body: data }); const result = await response.json() as { url?: string; error?: string }; if (!response.ok || !result.url) { setNotice(result.error || "Upload failed."); return; } update({ ...content, resume: { url: result.url, updatedAt: new Date().toISOString(), visible: true } }); setNotice("Résumé uploaded. Publish the content to activate it."); };
  return <Widget title="Résumé" description="Upload a PDF or use an external URL. The public link appears only when visible."><label>Résumé URL<input value={content.resume.url} onChange={(e) => update({ ...content, resume: { ...content.resume, url: e.target.value } })} /></label><label className="file-input">Upload PDF<input type="file" accept="application/pdf" onChange={upload} /></label><label className="check"><input type="checkbox" checked={content.resume.visible} onChange={(e) => update({ ...content, resume: { ...content.resume, visible: e.target.checked } })} /> Visible publicly</label></Widget>;
}

function AnalyticsEditor({ content, update }: EditorProps) {
  const metrics = content.analytics.publicMetrics;
  return <Widget title="Public analytics" description="Your dashboard remains private. Only explicitly selected aggregate metrics may appear publicly.">{Object.entries(metrics).map(([key, value]) => <label className="metric-toggle" key={key}><span><strong>{key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</strong><small>Aggregate only · never individual visitors</small></span><input type="checkbox" checked={value} onChange={(e) => update({ ...content, analytics: { publicMetrics: { ...metrics, [key]: e.target.checked } } })} /></label>)}</Widget>;
}

function Preview({ content }: { content: SiteContent }) { return <div className="admin-preview"><p className="eyebrow">DRAFT PREVIEW</p><h2>{content.identity.en.heroFirst}<br /><span>{content.identity.en.heroSecond}</span></h2><p>{content.identity.en.intro}</p><div>{content.socials.filter((social) => social.visible).sort((a, b) => a.order - b.order).map((social) => <span key={social.id}>{social.label}</span>)}</div><h3>{content.linkedinPosts.filter((post) => post.visible).length} published LinkedIn posts · Résumé {content.resume.visible ? "visible" : "hidden"}</h3></div>; }
function Widget({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <div className="admin-widget"><header><h2>{title}</h2><p>{description}</p></header>{children}</div>; }
type EditorProps = { content: SiteContent; update: (content: SiteContent) => void };
