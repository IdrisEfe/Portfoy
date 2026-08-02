import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { publishSiteContent, readSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";
export async function GET() { const session = await getAdminSession(); if (!session) return NextResponse.json({ authenticated: false }, { status: 401 }); return NextResponse.json({ authenticated: true, user: session.login, content: await readSiteContent() }); }
export async function PUT(request: Request) { const session = await getAdminSession(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { return NextResponse.json(await publishSiteContent(await request.json(), session)); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Publish failed." }, { status: 400 }); } }
