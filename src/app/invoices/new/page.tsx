import { AuthGuard } from "@/components/layout/auth-guard";
import { InvoiceForm } from "@/components/invoice/invoice-form";

export default function NewInvoicePage() {
  return (
    <AuthGuard>
      <div className="container-page space-y-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-mint">Create invoice</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">New GST invoice</h1>
        </div>
        <InvoiceForm />
      </div>
    </AuthGuard>
  );
}
