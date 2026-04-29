"use client";

import type { AuthSession, UserAccount, UserProfile } from "@/types/auth";

const USERS_KEY = "gst-users";
const SESSION_KEY = "gst-session";
export const AUTH_CHANGE_EVENT = "gst-auth-change";

export const emptyProfile: UserProfile = {
  businessName: "",
  gstin: "",
  address: "",
  contact: "",
  logoDataUrl: "",
  defaultPlaceOfSupply: "",
  defaultStateCode: "",
  defaultTerms: "Payment due within 15 days. Subject to applicable GST rules.",
};

function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function getUsers(): UserAccount[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as UserAccount[]) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: UserAccount[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

export function getCurrentUser() {
  const session = getCurrentSession();
  if (!session) return null;
  return getUsers().find((user) => user.id === session.userId) ?? null;
}

export function signUpUser(input: { name: string; email: string; password: string }) {
  const users = getUsers();
  const email = input.email.trim().toLowerCase();

  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: UserAccount = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    password: input.password,
    profile: emptyProfile,
    createdAt: new Date().toISOString(),
  };

  saveUsers([user, ...users]);
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  emitAuthChange();
  return user;
}

export function loginUser(input: { email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const user = getUsers().find((item) => item.email === email && item.password === input.password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
  emitAuthChange();
  return user;
}

export function logoutUser() {
  window.localStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}

export function updateCurrentUserProfile(profile: UserProfile) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error("Please login to update profile settings.");
  }

  const users = getUsers().map((user) => (user.id === currentUser.id ? { ...user, profile } : user));
  saveUsers(users);
  emitAuthChange();
  return users.find((user) => user.id === currentUser.id)!;
}

export function deleteUserAccount(userId: string) {
  const users = getUsers().filter((user) => user.id !== userId);
  saveUsers(users);

  const session = getCurrentSession();
  if (session?.userId === userId) {
    window.localStorage.removeItem(SESSION_KEY);
  }

  emitAuthChange();
  return users;
}
