import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";
import { uploadAdminAsset } from "@/lib/content-store";
export async function POST(request: Request) { const session = await getAdminSession(); if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); try { const file = (await request.formData()).get("file"); if (!(file instanceof File)) throw new Error("No file was supplied."); return NextResponse.json({ url: await uploadAdminAsset(file, session) }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 }); } }
