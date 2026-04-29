"use client";

import { getCurrentSession } from "@/lib/auth";
import type { Invoice } from "@/types/invoice";

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data as T;
}

function requireUserId() {
  const session = getCurrentSession();
  if (!session) {
    throw new Error("Please login first.");
  }
  return session.userId;
}

export async function getInvoices(): Promise<Invoice[]> {
  const userId = requireUserId();
  const data = await apiRequest<{ invoices: Invoice[] }>(`/api/invoices?userId=${encodeURIComponent(userId)}`);
  return data.invoices;
}

export async function upsertInvoice(invoice: Invoice) {
  const userId = requireUserId();
  const data = await apiRequest<{ invoice: Invoice }>("/api/invoices", {
    method: "POST",
    body: JSON.stringify({ userId, invoice }),
  });
  return data.invoice;
}

export async function deleteInvoice(id: string) {
  const userId = requireUserId();
  await apiRequest<{ ok: true }>(`/api/invoices/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
  return getInvoices();
}

export async function getInvoiceById(id: string) {
  const userId = requireUserId();
  const data = await apiRequest<{ invoice: Invoice | null }>(`/api/invoices/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`);
  return data.invoice;
}
