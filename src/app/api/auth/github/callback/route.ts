import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminCookie, sealSession } from "@/lib/admin-session";

export async function GET(request: Request) {
  const url = new URL(request.url); const code = url.searchParams.get("code"); const state = url.searchParams.get("state"); const cookieStore = await cookies();
  const expectedState = cookieStore.get("iesy_oauth_state")?.value; cookieStore.delete("iesy_oauth_state");
  if (!code || !state || state !== expectedState) return NextResponse.redirect(new URL("/admin?error=invalid_state", request.url));
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ client_id: process.env.GITHUB_OAUTH_CLIENT_ID, client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET, code }) });
  const tokenData = await tokenResponse.json() as { access_token?: string };
  if (!tokenData.access_token) return NextResponse.redirect(new URL("/admin?error=oauth_failed", request.url));
  const userResponse = await fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/vnd.github+json" } });
  const user = await userResponse.json() as { id?: number; login?: string };
  const allowedId = Number(process.env.ADMIN_GITHUB_USER_ID || 0); const allowedLogin = process.env.ADMIN_GITHUB_LOGIN?.toLowerCase();
  if (!user.id || !user.login || !((allowedId && user.id === allowedId) || (allowedLogin && user.login.toLowerCase() === allowedLogin))) return NextResponse.redirect(new URL("/admin?error=unauthorized", request.url));
  const session = sealSession({ id: user.id, login: user.login, accessToken: tokenData.access_token, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
  const response = NextResponse.redirect(new URL("/admin", request.url)); response.cookies.set(adminCookie.name, session, adminCookie.options); return response;
}
