"use client";

import type { AuthSession, UserAccount, UserProfile } from "@/types/auth";
import type { Invoice } from "@/types/invoice";
export { emptyProfile } from "@/lib/defaults";

const SESSION_KEY = "gst-session";
export const AUTH_CHANGE_EVENT = "gst-auth-change";

export interface AdminUserRow {
  user: UserAccount;
  invoices: Invoice[];
}

function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

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

export function getCurrentSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function setSession(userId: string) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
  emitAuthChange();
}

export async function getCurrentUser() {
  const session = getCurrentSession();
  if (!session) return null;

  const data = await apiRequest<{ user: UserAccount | null }>(`/api/auth/me?userId=${encodeURIComponent(session.userId)}`);
  return data.user;
}

export async function signUpUser(input: { name: string; email: string; password: string }) {
  const data = await apiRequest<{ user: UserAccount }>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setSession(data.user.id);
  return data.user;
}

export async function loginUser(input: { email: string; password: string }) {
  const data = await apiRequest<{ user: UserAccount }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  setSession(data.user.id);
  return data.user;
}

export function logoutUser() {
  window.localStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}

export async function updateCurrentUserProfile(profile: UserProfile) {
  const session = getCurrentSession();
  if (!session) {
    throw new Error("Please login to update profile settings.");
  }

  const data = await apiRequest<{ user: UserAccount }>("/api/profile", {
    method: "PUT",
    body: JSON.stringify({ userId: session.userId, profile }),
  });
  emitAuthChange();
  return data.user;
}

export async function getAdminUsers() {
  const data = await apiRequest<{ users: AdminUserRow[] }>("/api/admin/users");
  return data.users;
}

export async function deleteUserAccount(userId: string) {
  await apiRequest<{ ok: true }>(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });

  const session = getCurrentSession();
  if (session?.userId === userId) {
    window.localStorage.removeItem(SESSION_KEY);
  }

  emitAuthChange();
}
