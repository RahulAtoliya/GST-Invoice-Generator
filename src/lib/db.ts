import { neon } from "@neondatabase/serverless";
import type { Invoice } from "@/types/invoice";
import type { UserAccount, UserProfile } from "@/types/auth";

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export function hasDatabase() {
  return Boolean(sql);
}

export async function ensureDatabase() {
  if (!sql) {
    throw new Error("DATABASE_URL is not configured.");
  }

  await sql`
    CREATE TABLE IF NOT EXISTS app_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      profile JSONB NOT NULL,
      created_at TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
      data JSONB NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `;
}

function toUser(row: {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: UserProfile;
  created_at: string;
}): UserAccount {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    profile: row.profile,
    createdAt: row.created_at,
  };
}

export async function findUsers() {
  await ensureDatabase();
  const rows = await sql!`SELECT id, name, email, password, profile, created_at FROM app_users ORDER BY created_at DESC`;
  return rows.map((row) => toUser(row as Parameters<typeof toUser>[0]));
}

export async function findUserById(id: string) {
  await ensureDatabase();
  const rows = await sql!`SELECT id, name, email, password, profile, created_at FROM app_users WHERE id = ${id} LIMIT 1`;
  return rows[0] ? toUser(rows[0] as Parameters<typeof toUser>[0]) : null;
}

export async function findUserByEmail(email: string) {
  await ensureDatabase();
  const rows = await sql!`SELECT id, name, email, password, profile, created_at FROM app_users WHERE email = ${email} LIMIT 1`;
  return rows[0] ? toUser(rows[0] as Parameters<typeof toUser>[0]) : null;
}

export async function createUser(user: UserAccount) {
  await ensureDatabase();
  await sql!`
    INSERT INTO app_users (id, name, email, password, profile, created_at)
    VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password}, ${JSON.stringify(user.profile)}, ${user.createdAt})
  `;
  return user;
}

export async function updateUserProfile(userId: string, profile: UserProfile) {
  await ensureDatabase();
  await sql!`UPDATE app_users SET profile = ${JSON.stringify(profile)} WHERE id = ${userId}`;
  return findUserById(userId);
}

export async function removeUser(userId: string) {
  await ensureDatabase();
  await sql!`DELETE FROM app_users WHERE id = ${userId}`;
}

export async function findInvoicesByUser(userId: string) {
  await ensureDatabase();
  const rows = await sql!`SELECT data FROM invoices WHERE user_id = ${userId} ORDER BY updated_at DESC`;
  return rows.map((row) => row.data as Invoice);
}

export async function findInvoiceById(userId: string, invoiceId: string) {
  await ensureDatabase();
  const rows = await sql!`SELECT data FROM invoices WHERE user_id = ${userId} AND id = ${invoiceId} LIMIT 1`;
  return rows[0] ? (rows[0].data as Invoice) : null;
}

export async function upsertInvoiceForUser(userId: string, invoice: Invoice) {
  await ensureDatabase();
  await sql!`
    INSERT INTO invoices (id, user_id, data, created_at, updated_at)
    VALUES (${invoice.id}, ${userId}, ${JSON.stringify(invoice)}, ${invoice.createdAt}, ${invoice.updatedAt})
    ON CONFLICT (id)
    DO UPDATE SET data = ${JSON.stringify(invoice)}, updated_at = ${invoice.updatedAt}
  `;
  return invoice;
}

export async function removeInvoiceForUser(userId: string, invoiceId: string) {
  await ensureDatabase();
  await sql!`DELETE FROM invoices WHERE user_id = ${userId} AND id = ${invoiceId}`;
}
