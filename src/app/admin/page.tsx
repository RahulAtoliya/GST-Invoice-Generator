"use client";

import { Trash2, Users, WalletCards } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminGuard } from "@/components/layout/admin-guard";
import { Button } from "@/components/ui/button";
import { calculateInvoice } from "@/lib/calculations";
import { deleteUserAccount, getAdminUsers } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { UserAccount } from "@/types/auth";
import type { Invoice } from "@/types/invoice";

interface UserRow {
  user: UserAccount;
  invoices: Invoice[];
  invoiceCount: number;
  taxableTotal: number;
  gstTotal: number;
  grandTotal: number;
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}

function AdminDashboard() {
  const [rows, setRows] = useState<UserRow[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const users = await getAdminUsers();
        setRows(
          users.map(({ user, invoices }) => {
            const totals = invoices.reduce(
              (acc, invoice) => {
                const calc = calculateInvoice(invoice);
                return {
                  taxableTotal: acc.taxableTotal + calc.taxableTotal,
                  gstTotal: acc.gstTotal + calc.totalGst,
                  grandTotal: acc.grandTotal + calc.grandTotal,
                };
              },
              { taxableTotal: 0, gstTotal: 0, grandTotal: 0 },
            );

            return {
              user,
              invoices,
              invoiceCount: invoices.length,
              ...totals,
            };
          }),
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load users.");
      }
    }

    loadUsers();
  }, []);

  const stats = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          users: acc.users + 1,
          invoices: acc.invoices + row.invoiceCount,
          taxable: acc.taxable + row.taxableTotal,
          gst: acc.gst + row.gstTotal,
          total: acc.total + row.grandTotal,
        }),
        { users: 0, invoices: 0, taxable: 0, gst: 0, total: 0 },
      ),
    [rows],
  );

  async function handleDeleteUser(userId: string) {
    try {
      await deleteUserAccount(userId);
      setRows((current) => current.filter((row) => row.user.id !== userId));
      toast.success("User and invoices deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete user.");
    }
  }

  return (
    <div className="container-page space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-mint">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">User management</h1>
        <p className="mt-2 text-sm text-stone-600">View registered users, profile status, and invoice activity.</p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Users" value={String(stats.users)} />
        <StatCard label="Invoices" value={String(stats.invoices)} />
        <StatCard label="Taxable" value={formatCurrency(stats.taxable)} />
        <StatCard label="GST" value={formatCurrency(stats.gst)} />
        <StatCard label="Grand total" value={formatCurrency(stats.total)} />
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="text-lg font-bold text-ink">Registered users</h2>
          <p className="text-sm text-stone-500">LocalStorage users created from signup.</p>
        </div>

        <div className="divide-y divide-stone-200 md:hidden">
          {rows.map((row) => (
            <article key={row.user.id} className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-ink">{row.user.name}</p>
                  <p className="break-words text-xs text-stone-500">{row.user.email}</p>
                  <p className="mt-1 text-xs text-stone-500">Joined {formatDate(row.user.createdAt)}</p>
                </div>
                <Button type="button" variant="danger" className="shrink-0 px-3" onClick={() => handleDeleteUser(row.user.id)} title="Delete user">
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-md bg-stone-50 p-3 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-500">Business</p>
                  <p className="mt-1 break-words text-stone-800">{row.user.profile.businessName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-500">GSTIN</p>
                  <p className="mt-1 break-words text-stone-800">{row.user.profile.gstin || "-"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-500">Invoices</p>
                  <p className="mt-1 font-semibold text-stone-800">{row.invoiceCount}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-stone-500">Total</p>
                  <p className="mt-1 font-semibold text-stone-800">{formatCurrency(row.grandTotal)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Business</th>
                <th className="px-5 py-3">GSTIN</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Invoices</th>
                <th className="px-5 py-3 text-right">GST</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.user.id} className="border-t border-stone-200">
                  <td className="px-5 py-4">
                    <p className="font-bold text-ink">{row.user.name}</p>
                    <p className="text-xs text-stone-500">{row.user.email}</p>
                  </td>
                  <td className="px-5 py-4 text-stone-700">{row.user.profile.businessName || "-"}</td>
                  <td className="px-5 py-4 text-stone-700">{row.user.profile.gstin || "-"}</td>
                  <td className="px-5 py-4 text-stone-600">{formatDate(row.user.createdAt)}</td>
                  <td className="px-5 py-4 text-right">{row.invoiceCount}</td>
                  <td className="px-5 py-4 text-right">{formatCurrency(row.gstTotal)}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatCurrency(row.grandTotal)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <Button type="button" variant="danger" className="px-3" onClick={() => handleDeleteUser(row.user.id)} title="Delete user">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 ? <p className="px-5 py-10 text-center text-sm text-stone-500">No users have signed up yet.</p> : null}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-amber-100 text-amber-700">
          {label === "Users" ? <Users className="size-5" /> : <WalletCards className="size-5" />}
        </span>
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}
