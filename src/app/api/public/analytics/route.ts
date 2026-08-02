import { NextResponse } from "next/server";
import { siteContent } from "@/lib/content";
import { getPublicAnalytics } from "@/lib/umami";
export async function GET() { try { const data = await getPublicAnalytics(siteContent.analytics.publicMetrics); return data ? NextResponse.json(data) : new NextResponse(null, { status: 204 }); } catch { return new NextResponse(null, { status: 204 }); } }
