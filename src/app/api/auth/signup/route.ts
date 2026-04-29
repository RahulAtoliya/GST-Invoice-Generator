import { NextResponse } from "next/server";
import { createUser, findUserByEmail, hasDatabase } from "@/lib/db";
import { emptyProfile } from "@/lib/defaults";
import type { UserAccount } from "@/types/auth";

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const body = (await request.json()) as { name?: string; email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();

  if (!body.name || !email || !body.password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const user: UserAccount = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    email,
    password: body.password,
    profile: emptyProfile,
    createdAt: new Date().toISOString(),
  };

  await createUser(user);
  return NextResponse.json({ user });
}
