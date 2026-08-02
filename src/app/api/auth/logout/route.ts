import { NextResponse } from "next/server";
import { adminCookie } from "@/lib/admin-session";
export async function POST(request: Request) { const response = NextResponse.redirect(new URL("/admin", request.url), 303); response.cookies.set(adminCookie.name, "", { ...adminCookie.options, maxAge: 0 }); return response; }
