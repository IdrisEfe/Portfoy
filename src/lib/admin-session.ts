import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export type AdminSession = { id: number; login: string; accessToken: string; expiresAt: number };
const cookieName = "iesy_admin";

function key() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 24) throw new Error("ADMIN_SESSION_SECRET must contain at least 24 characters.");
  return createHash("sha256").update(secret).digest();
}

export function sealSession(session: AdminSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function openSession(value: string): AdminSession | null {
  try {
    const data = Buffer.from(value, "base64url"); const iv = data.subarray(0, 12); const tag = data.subarray(12, 28); const encrypted = data.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv); decipher.setAuthTag(tag);
    const session = JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8")) as AdminSession;
    return session.expiresAt > Date.now() ? session : null;
  } catch { return null; }
}

export async function getAdminSession() {
  if (process.env.ADMIN_DEV_BYPASS === "true" && process.env.NODE_ENV !== "production") return { id: 0, login: "local-admin", accessToken: "", expiresAt: Date.now() + 3600000 } satisfies AdminSession;
  const value = (await cookies()).get(cookieName)?.value;
  return value ? openSession(value) : null;
}

export const adminCookie = { name: cookieName, options: { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 } };
