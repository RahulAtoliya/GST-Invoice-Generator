"use client";

import type { AdminSession } from "@/types/auth";

const ADMIN_SESSION_KEY = "gst-admin-session";
export const ADMIN_CHANGE_EVENT = "gst-admin-change";
export const ADMIN_EMAIL = "admin@gst.local";
export const ADMIN_PASSWORD = "admin123";

function emitAdminChange() {
  window.dispatchEvent(new Event(ADMIN_CHANGE_EVENT));
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AdminSession) : null;
  } catch {
    return null;
  }
}

export function loginAdmin(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();

  if (email !== ADMIN_EMAIL || input.password !== ADMIN_PASSWORD) {
    throw new Error("Invalid admin email or password.");
  }

  const session = { email: ADMIN_EMAIL };
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  emitAdminChange();
  return session;
}

export function logoutAdmin() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
  emitAdminChange();
}
