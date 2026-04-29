"use client";

import Link from "next/link";
import { Download, Edit, FilePlus2, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Button } from "@/components/ui/button";
import { calculateInvoice } from "@/lib/calculations";
import { downloadInvoicePdf } from "@/lib/pdf";
import { deleteInvoice, getInvoices } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

export default function InvoicesPage() {
  return (
    <AuthGuard>
      <InvoicesContent />
    </AuthGuard>
  );
}

function InvoicesContent() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const filteredInvoices = useMemo(() => {
    const normalized = query.toLowerCase();
    return invoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(normalized) ||
        invoice.buyerName.toLowerCase().includes(normalized) ||
        invoice.sellerBusinessName.toLowerCase().includes(normalized),
    );
  }, [invoices, query]);

  function handleDelete(id: string) {
    setInvoices(deleteInvoice(id));
    toast.success("Invoice deleted");
  }

  return (
    <div className="container-page space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-mint">Invoice management</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Invoice history</h1>
        </div>
        <Link href="/invoices/new">
          <Button>
            <FilePlus2 className="size-4" /> New invoice
          </Button>
        </Link>
      </div>

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stone-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-bold text-ink">Saved invoices</h2>
          <label className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input
              className="field-input mt-0 pl-9"
              placeholder="Search invoices"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="divide-y divide-stone-200 md:hidden">
          {filteredInvoices.map((invoice) => {
            const calc = calculateInvoice(invoice);
            return (
              <article key={invoice.id} className="space-y-3 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/invoices/${invoice.id}`} className="font-bold text-ink">
                      {invoice.invoiceNumber}
                    </Link>
                    <p className="mt-1 text-sm text-stone-600">{invoice.buyerName}</p>
                    <p className="text-xs text-stone-500">{formatDate(invoice.invoiceDate)}</p>
                  </div>
                  <p className="shrink-0 text-right font-bold text-ink">{formatCurrency(calc.grandTotal)}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-md bg-stone-50 p-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase text-stone-500">Seller</p>
                    <p className="mt-1 truncate text-stone-800">{invoice.sellerBusinessName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase text-stone-500">GST</p>
                    <p className="mt-1 font-semibold text-stone-800">{formatCurrency(calc.totalGst)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button type="button" variant="secondary" className="px-2" onClick={() => downloadInvoicePdf(invoice)} title="Download PDF">
                    <Download className="size-4" />
                  </Button>
                  <Link href={`/invoices/${invoice.id}`}>
                    <Button type="button" variant="secondary" className="w-full px-2" title="Edit invoice">
                      <Edit className="size-4" />
                    </Button>
                  </Link>
                  <Button type="button" variant="danger" className="px-2" onClick={() => handleDelete(invoice.id)} title="Delete invoice">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Seller</th>
                <th className="px-5 py-3">Buyer</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">GST</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const calc = calculateInvoice(invoice);
                return (
                  <tr key={invoice.id} className="border-t border-stone-200">
                    <td className="px-5 py-4 font-bold text-ink">
                      <Link href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                    </td>
                    <td className="px-5 py-4 text-stone-700">{invoice.sellerBusinessName}</td>
                    <td className="px-5 py-4 text-stone-700">{invoice.buyerName}</td>
                    <td className="px-5 py-4 text-stone-600">{formatDate(invoice.invoiceDate)}</td>
                    <td className="px-5 py-4 text-right">{formatCurrency(calc.totalGst)}</td>
                    <td className="px-5 py-4 text-right font-bold">{formatCurrency(calc.grandTotal)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="secondary" className="px-3" onClick={() => downloadInvoicePdf(invoice)} title="Download PDF">
                          <Download className="size-4" />
                        </Button>
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button type="button" variant="secondary" className="px-3" title="Edit invoice">
                            <Edit className="size-4" />
                          </Button>
                        </Link>
                        <Button type="button" variant="danger" className="px-3" onClick={() => handleDelete(invoice.id)} title="Delete invoice">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 ? <p className="px-5 py-10 text-center text-sm text-stone-500">No invoices found.</p> : null}
      </section>
    </div>
  );
}
