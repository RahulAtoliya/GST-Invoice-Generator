"use client";

import type { Invoice } from "@/types/invoice";
import { getCurrentUser } from "@/lib/auth";

const STORAGE_KEY = "gst-invoices";
const REMOVED_SAMPLE_INVOICE_ID = "sample-invoice";

function getStorageKey() {
  const user = getCurrentUser();
  return user ? `${STORAGE_KEY}:${user.id}` : STORAGE_KEY;
}

export function getInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(getStorageKey());
    const invoices = raw ? (JSON.parse(raw) as Invoice[]) : [];
    const cleanedInvoices = invoices.filter((invoice) => invoice.id !== REMOVED_SAMPLE_INVOICE_ID);

    if (cleanedInvoices.length !== invoices.length) {
      saveInvoices(cleanedInvoices);
    }

    return cleanedInvoices;
  } catch {
    return [];
  }
}

export function hasInvoiceStore() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(getStorageKey()) !== null;
}

export function saveInvoices(invoices: Invoice[]) {
  window.localStorage.setItem(getStorageKey(), JSON.stringify(invoices));
}

export function upsertInvoice(invoice: Invoice) {
  const invoices = getInvoices();
  const index = invoices.findIndex((item) => item.id === invoice.id);
  const next = index >= 0 ? invoices.map((item) => (item.id === invoice.id ? invoice : item)) : [invoice, ...invoices];
  saveInvoices(next);
  return next;
}

export function deleteInvoice(id: string) {
  const next = getInvoices().filter((invoice) => invoice.id !== id);
  saveInvoices(next);
  return next;
}

export function getInvoiceById(id: string) {
  return getInvoices().find((invoice) => invoice.id === id);
}

export function getInvoicesForUserId(userId: string): Invoice[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY}:${userId}`);
    const invoices = raw ? (JSON.parse(raw) as Invoice[]) : [];
    return invoices.filter((invoice) => invoice.id !== REMOVED_SAMPLE_INVOICE_ID);
  } catch {
    return [];
  }
}

export function deleteInvoicesForUserId(userId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${STORAGE_KEY}:${userId}`);
}
