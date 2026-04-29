import { NextResponse } from "next/server";
import { findInvoiceById, hasDatabase, removeInvoiceForUser } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  const { id } = await params;
  const invoice = await findInvoiceById(userId, id);
  return NextResponse.json({ invoice });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  const { id } = await params;
  await removeInvoiceForUser(userId, id);
  return NextResponse.json({ ok: true });
}
