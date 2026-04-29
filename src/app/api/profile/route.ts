import { NextResponse } from "next/server";
import { updateUserProfile, hasDatabase } from "@/lib/db";
import type { UserProfile } from "@/types/auth";

export async function PUT(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const body = (await request.json()) as { userId?: string; profile?: UserProfile };
  if (!body.userId || !body.profile) {
    return NextResponse.json({ error: "User id and profile are required." }, { status: 400 });
  }

  const user = await updateUserProfile(body.userId, body.profile);
  return NextResponse.json({ user });
}
