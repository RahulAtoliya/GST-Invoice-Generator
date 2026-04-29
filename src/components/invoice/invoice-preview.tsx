import { calculateInvoice } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

export function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const calc = calculateInvoice(invoice);

  return (
    <section className="panel overflow-hidden bg-white">
      <div className="border-b-4 border-mint px-5 py-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            {invoice.sellerLogoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.sellerLogoDataUrl}
                alt={`${invoice.sellerBusinessName} logo`}
                className="size-16 rounded-md border border-stone-200 object-contain"
              />
            ) : null}
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-mint">Tax Invoice</p>
              <h2 className="mt-2 break-words text-xl font-bold text-ink sm:text-2xl">{invoice.sellerBusinessName}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600">{invoice.sellerAddress}</p>
              <p className="mt-1 break-words text-sm font-semibold text-stone-700">GSTIN: {invoice.sellerGstin}</p>
              <p className="break-words text-sm text-stone-600">{invoice.sellerContact}</p>
            </div>
          </div>
          <div className="w-full rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm sm:w-auto">
            <p>
              <span className="font-semibold">Invoice:</span> {invoice.invoiceNumber}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formatDate(invoice.invoiceDate)}
            </p>
            <p>
              <span className="font-semibold">Due:</span> {formatDate(invoice.dueDate)}
            </p>
            <p>
              <span className="font-semibold">Supply:</span> {invoice.placeOfSupply} ({invoice.stateCode})
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-5 py-6 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Bill To</p>
          <h3 className="mt-2 text-lg font-bold text-ink">{invoice.buyerName}</h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">{invoice.buyerAddress}</p>
          <p className="mt-1 text-sm font-semibold text-stone-700">GSTIN: {invoice.buyerGstin}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Amount in words</p>
          <p className="mt-1 text-sm text-amber-900">{calc.amountInWords}</p>
        </div>
      </div>

      <div className="space-y-3 px-4 md:hidden">
        {invoice.items.map((item, index) => {
          const itemCalc = calc.items[index];
          return (
            <div key={item.id} className="rounded-lg border border-stone-200 bg-white p-4 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-bold text-stone-900">{item.name}</p>
                  <p className="mt-1 text-xs text-stone-500">HSN/SAC: {item.hsnSac}</p>
                </div>
                <p className="shrink-0 font-bold text-ink">{formatCurrency(itemCalc.total)}</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 rounded-md bg-stone-50 p-3">
                <p>
                  <span className="text-stone-500">Qty:</span> {item.quantity}
                </p>
                <p className="text-right">
                  <span className="text-stone-500">Rate:</span> {formatCurrency(item.unitPrice)}
                </p>
                <p>
                  <span className="text-stone-500">Discount:</span> {formatCurrency(itemCalc.discountAmount)}
                </p>
                <p className="text-right">
                  <span className="text-stone-500">GST:</span> {formatCurrency(itemCalc.totalGst)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto px-5 md:block">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-mint text-left text-white">
              <th className="px-3 py-3">Item / Service</th>
              <th className="px-3 py-3">HSN/SAC</th>
              <th className="px-3 py-3 text-right">Qty</th>
              <th className="px-3 py-3 text-right">Rate</th>
              <th className="px-3 py-3 text-right">Discount</th>
              <th className="px-3 py-3 text-right">GST</th>
              <th className="px-3 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const itemCalc = calc.items[index];
              return (
                <tr key={item.id} className="border-b border-stone-200">
                  <td className="px-3 py-3 font-medium text-stone-900">{item.name}</td>
                  <td className="px-3 py-3 text-stone-600">{item.hsnSac}</td>
                  <td className="px-3 py-3 text-right">{item.quantity}</td>
                  <td className="px-3 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-3 py-3 text-right">{formatCurrency(itemCalc.discountAmount)}</td>
                  <td className="px-3 py-3 text-right">{formatCurrency(itemCalc.totalGst)}</td>
                  <td className="px-3 py-3 text-right font-semibold">{formatCurrency(itemCalc.total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 px-4 py-6 sm:px-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 text-sm">
          {invoice.notes ? (
            <div>
              <p className="font-bold text-stone-800">Notes</p>
              <p className="mt-1 leading-6 text-stone-600">{invoice.notes}</p>
            </div>
          ) : null}
          {invoice.terms ? (
            <div>
              <p className="font-bold text-stone-800">Terms & Conditions</p>
              <p className="mt-1 leading-6 text-stone-600">{invoice.terms}</p>
            </div>
          ) : null}
          <div className="pt-8">
            <div className="h-12 w-full max-w-48 border-b border-stone-400" />
            <p className="mt-2 text-sm font-semibold text-stone-700">Authorized Signature</p>
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <SummaryRow label="Subtotal" value={calc.subtotal} />
          <SummaryRow label="Discount" value={calc.discountTotal} />
          <SummaryRow label="Taxable Amount" value={calc.taxableTotal} />
          <SummaryRow label="CGST" value={calc.cgstTotal} />
          <SummaryRow label="SGST" value={calc.sgstTotal} />
          <SummaryRow label="IGST" value={calc.igstTotal} />
          <SummaryRow label="Total GST" value={calc.totalGst} />
          <div className="mt-3 border-t border-stone-300 pt-3">
            <SummaryRow label="Grand Total" value={calc.grandTotal} strong />
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className={strong ? "flex justify-between py-1 text-lg font-bold text-ink" : "flex justify-between py-1 text-sm"}>
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
