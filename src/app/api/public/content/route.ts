import { NextResponse } from "next/server";
import { readSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = NextResponse.json(await readSiteContent());
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
