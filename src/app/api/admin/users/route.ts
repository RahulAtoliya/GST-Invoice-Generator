import { NextResponse } from "next/server";
import { findInvoicesByUser, findUsers, hasDatabase, removeUser } from "@/lib/db";

export async function GET() {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const users = await findUsers();
  const usersWithInvoices = await Promise.all(
    users.map(async (user) => ({
      user,
      invoices: await findInvoicesByUser(user.id),
    })),
  );

  return NextResponse.json({ users: usersWithInvoices });
}

export async function DELETE(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  await removeUser(userId);
  return NextResponse.json({ ok: true });
}
