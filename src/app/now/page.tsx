import type { Metadata } from "next";
import { getRepositories } from "@/lib/github";
import { siteContent } from "@/lib/content";
import { NowExperience } from "@/components/now-experience";
export const metadata: Metadata = { title: "Now" };
export default async function NowPage() { return <NowExperience repositories={(await getRepositories()).slice(0, 5)} posts={siteContent.linkedinPosts.filter((post) => post.visible)} />; }
