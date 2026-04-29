import { NextResponse } from "next/server";
import { findInvoicesByUser, hasDatabase, upsertInvoiceForUser } from "@/lib/db";
import type { Invoice } from "@/types/invoice";

export async function GET(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  const invoices = await findInvoicesByUser(userId);
  return NextResponse.json({ invoices });
}

export async function POST(request: Request) {
  if (!hasDatabase()) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 500 });
  }

  const body = (await request.json()) as { userId?: string; invoice?: Invoice };
  if (!body.userId || !body.invoice) {
    return NextResponse.json({ error: "User id and invoice are required." }, { status: 400 });
  }

  const invoice = await upsertInvoiceForUser(body.userId, body.invoice);
  return NextResponse.json({ invoice });
}
