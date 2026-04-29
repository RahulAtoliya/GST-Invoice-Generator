"use client";

import Link from "next/link";
import { ArrowRight, FilePlus2, ReceiptIndianRupee } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Button } from "@/components/ui/button";
import { calculateInvoice } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getInvoices } from "@/lib/storage";
import type { Invoice } from "@/types/invoice";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    getInvoices().then(setInvoices).catch(() => setInvoices([]));
  }, []);

  const stats = useMemo(() => {
    return invoices.reduce(
      (acc, invoice) => {
        const calc = calculateInvoice(invoice);
        return {
          taxable: acc.taxable + calc.taxableTotal,
          gst: acc.gst + calc.totalGst,
          total: acc.total + calc.grandTotal,
        };
      },
      { taxable: 0, gst: 0, total: 0 },
    );
  }, [invoices]);

  return (
    <div className="container-page space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-mint">Invoice dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">GST invoice workspace</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Create professional Indian GST invoices, review tax breakups, and download printable A4 PDFs.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <FilePlus2 className="size-4" /> Create invoice
          </Button>
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total invoices" value={String(invoices.length)} />
        <StatCard label="Taxable amount" value={formatCurrency(stats.taxable)} />
        <StatCard label="GST collected" value={formatCurrency(stats.gst)} />
        <StatCard label="Grand total" value={formatCurrency(stats.total)} />
      </section>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">Recent invoices</h2>
            <p className="text-sm text-stone-500">Your latest saved invoices appear here.</p>
          </div>
          <Link href="/invoices" className="inline-flex items-center gap-1 text-sm font-bold text-mint">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="divide-y divide-stone-200 md:hidden">
          {invoices.slice(0, 5).map((invoice) => {
            const calc = calculateInvoice(invoice);
            return (
              <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="block px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{invoice.invoiceNumber}</p>
                    <p className="mt-1 truncate text-sm text-stone-700">{invoice.buyerName}</p>
                    <p className="text-xs text-stone-500">{formatDate(invoice.invoiceDate)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-bold text-ink">{formatCurrency(calc.grandTotal)}</p>
                    <p className="text-xs text-stone-500">GST {formatCurrency(calc.totalGst)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Buyer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Taxable</th>
                <th className="px-5 py-3 text-right">GST</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoices.slice(0, 5).map((invoice) => {
                const calc = calculateInvoice(invoice);
                return (
                  <tr key={invoice.id} className="border-t border-stone-200">
                    <td className="px-5 py-4 font-bold text-ink">
                      <Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                    </td>
                    <td className="px-5 py-4 text-stone-700">{invoice.buyerName}</td>
                    <td className="px-5 py-4 text-stone-600">{formatDate(invoice.invoiceDate)}</td>
                    <td className="px-5 py-4 text-right">{formatCurrency(calc.taxableTotal)}</td>
                    <td className="px-5 py-4 text-right">{formatCurrency(calc.totalGst)}</td>
                    <td className="px-5 py-4 text-right font-bold">{formatCurrency(calc.grandTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {invoices.length === 0 ? <p className="px-5 py-10 text-center text-sm text-stone-500">No invoices created yet.</p> : null}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-md bg-amber-100 text-amber-700">
          <ReceiptIndianRupee className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-stone-500">{label}</p>
          <p className="mt-1 text-xl font-bold text-ink">{value}</p>
        </div>
      </div>
    </div>
  );
}
