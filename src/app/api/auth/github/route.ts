import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: "GitHub OAuth is not configured." }, { status: 503 });
  const state = randomBytes(24).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set("iesy_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 600 });
  const siteUrl = process.env.SITE_URL || new URL(request.url).origin;
  const callback = new URL("/api/auth/github/callback", siteUrl).toString();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId); authorize.searchParams.set("redirect_uri", callback); authorize.searchParams.set("scope", "read:user public_repo"); authorize.searchParams.set("state", state);
  return NextResponse.redirect(authorize);
}
