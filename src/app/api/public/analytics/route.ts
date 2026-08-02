import { NextResponse } from "next/server";
import { readSiteContent } from "@/lib/content-store";
import { getPublicAnalytics } from "@/lib/umami";
export async function GET() { try { const data = await getPublicAnalytics((await readSiteContent()).analytics.publicMetrics); return data ? NextResponse.json(data) : new NextResponse(null, { status: 204 }); } catch { return new NextResponse(null, { status: 204 }); } }
