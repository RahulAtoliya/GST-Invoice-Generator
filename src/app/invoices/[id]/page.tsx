"use client";

import Link from "next/link";
import { Download, Edit, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/layout/auth-guard";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { InvoicePreview } from "@/components/invoice/invoice-preview";
import { Button } from "@/components/ui/button";
import { downloadInvoicePdf } from "@/lib/pdf";
import { deleteInvoice, getInvoiceById } from "@/lib/storage";
import type { Invoice } from "@/types/invoice";

export default function InvoiceDetailPage() {
  return (
    <AuthGuard>
      <InvoiceDetailContent />
    </AuthGuard>
  );
}

function InvoiceDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const found = getInvoiceById(params.id);
    setInvoice(found ?? null);
  }, [params.id]);

  function handleDelete() {
    if (!invoice) return;
    deleteInvoice(invoice.id);
    toast.success("Invoice deleted");
    router.push("/invoices");
  }

  if (!invoice) {
    return (
      <div className="container-page">
        <div className="panel p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">Invoice not found</h1>
          <p className="mt-2 text-sm text-stone-600">The invoice may have been deleted from local storage.</p>
          <Link href="/invoices" className="mt-5 inline-block">
            <Button>Back to invoices</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="container-page space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-mint">Edit invoice</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">{invoice.invoiceNumber}</h1>
          </div>
          <Button type="button" variant="secondary" className="w-full md:w-auto" onClick={() => setEditing(false)}>
            Cancel edit
          </Button>
        </div>
        <InvoiceForm initialInvoice={invoice} />
      </div>
    );
  }

  return (
    <div className="container-page space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-mint">Invoice preview</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{invoice.invoiceNumber}</h1>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:flex md:flex-wrap">
          <Button type="button" variant="secondary" onClick={() => setEditing(true)}>
            <Edit className="size-4" /> Edit
          </Button>
          <Button type="button" onClick={() => downloadInvoicePdf(invoice)}>
            <Download className="size-4" /> Download PDF
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete}>
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      </div>
      <InvoicePreview invoice={invoice} />
    </div>
  );
}
