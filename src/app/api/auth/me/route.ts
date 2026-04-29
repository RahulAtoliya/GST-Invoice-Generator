import { NextResponse } from "next/server";
import { findUserById, hasDatabase } from "@/lib/db";

export async function GET(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ user: null });
  }

  const user = await findUserById(userId);
  return NextResponse.json({ user });
}
