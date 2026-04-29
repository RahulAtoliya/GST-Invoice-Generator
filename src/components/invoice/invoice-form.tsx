"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { upsertInvoice } from "@/lib/storage";
import { invoiceSchema, type InvoiceFormInput, type InvoiceFormValues } from "@/lib/validations";
import type { Invoice } from "@/types/invoice";

const today = new Date().toISOString().slice(0, 10);

function newInvoiceDefaults(): Invoice {
  const now = new Date().toISOString();
  const profile = getCurrentUser()?.profile;

  return {
    id: crypto.randomUUID(),
    sellerBusinessName: profile?.businessName ?? "",
    sellerGstin: profile?.gstin ?? "",
    sellerAddress: profile?.address ?? "",
    sellerContact: profile?.contact ?? "",
    sellerLogoDataUrl: profile?.logoDataUrl ?? "",
    buyerName: "",
    buyerGstin: "",
    buyerAddress: "",
    invoiceNumber: `GST-${Date.now().toString().slice(-6)}`,
    invoiceDate: today,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    placeOfSupply: profile?.defaultPlaceOfSupply ?? "",
    stateCode: profile?.defaultStateCode ?? "",
    notes: "",
    terms: profile?.defaultTerms ?? "",
    createdAt: now,
    updatedAt: now,
    items: [
      {
        id: crypto.randomUUID(),
        name: "",
        hsnSac: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        gstRate: 18,
        taxType: "intra",
      },
    ],
  };
}

export function InvoiceForm({ initialInvoice }: { initialInvoice?: Invoice }) {
  const router = useRouter();
  const form = useForm<InvoiceFormInput, unknown, InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialInvoice ?? newInvoiceDefaults(),
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  function onSubmit(values: InvoiceFormValues) {
    const now = new Date().toISOString();
    const invoice: Invoice = {
      ...values,
      updatedAt: now,
      createdAt: values.createdAt || now,
      items: values.items.map((item) => ({
        ...item,
        gstRate: item.gstRate as Invoice["items"][number]["gstRate"],
      })),
    };

    upsertInvoice(invoice);
    toast.success("Invoice saved");
    router.push(`/invoices/${invoice.id}`);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <section className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Seller Details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Business name" error={form.formState.errors.sellerBusinessName?.message}>
              <input className="field-input" {...form.register("sellerBusinessName")} />
            </Field>
            <Field label="GSTIN" error={form.formState.errors.sellerGstin?.message}>
              <input className="field-input uppercase" {...form.register("sellerGstin")} />
            </Field>
            <Field label="Phone / email" error={form.formState.errors.sellerContact?.message}>
              <input className="field-input" {...form.register("sellerContact")} />
            </Field>
            <Field label="Address" error={form.formState.errors.sellerAddress?.message} wide>
              <textarea className="field-input min-h-24" {...form.register("sellerAddress")} />
            </Field>
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Buyer & Invoice</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Buyer name" error={form.formState.errors.buyerName?.message}>
              <input className="field-input" {...form.register("buyerName")} />
            </Field>
            <Field label="Buyer GSTIN" error={form.formState.errors.buyerGstin?.message}>
              <input className="field-input uppercase" {...form.register("buyerGstin")} />
            </Field>
            <Field label="Buyer address" error={form.formState.errors.buyerAddress?.message} wide>
              <textarea className="field-input min-h-24" {...form.register("buyerAddress")} />
            </Field>
            <Field label="Invoice number" error={form.formState.errors.invoiceNumber?.message}>
              <input className="field-input" {...form.register("invoiceNumber")} />
            </Field>
            <Field label="Invoice date" error={form.formState.errors.invoiceDate?.message}>
              <input type="date" className="field-input" {...form.register("invoiceDate")} />
            </Field>
            <Field label="Due date" error={form.formState.errors.dueDate?.message}>
              <input type="date" className="field-input" {...form.register("dueDate")} />
            </Field>
            <Field label="Place of supply" error={form.formState.errors.placeOfSupply?.message}>
              <input className="field-input" {...form.register("placeOfSupply")} />
            </Field>
            <Field label="State code" error={form.formState.errors.stateCode?.message}>
              <input className="field-input" maxLength={2} {...form.register("stateCode")} />
            </Field>
          </div>
        </section>

        <section className="panel p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-ink">Items & Services</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  id: crypto.randomUUID(),
                  name: "",
                  hsnSac: "",
                  quantity: 1,
                  unitPrice: 0,
                  discount: 0,
                  gstRate: 18,
                  taxType: "intra",
                })
              }
            >
              <Plus className="size-4" /> Add item
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <div className="grid gap-4 md:grid-cols-6">
                  <Field label="Item/service" error={form.formState.errors.items?.[index]?.name?.message} className="md:col-span-2">
                    <input className="field-input" {...form.register(`items.${index}.name`)} />
                  </Field>
                  <Field label="HSN/SAC" error={form.formState.errors.items?.[index]?.hsnSac?.message}>
                    <input className="field-input" {...form.register(`items.${index}.hsnSac`)} />
                  </Field>
                  <Field label="Quantity" error={form.formState.errors.items?.[index]?.quantity?.message}>
                    <input type="number" step="0.01" className="field-input" {...form.register(`items.${index}.quantity`, { valueAsNumber: true })} />
                  </Field>
                  <Field label="Unit price" error={form.formState.errors.items?.[index]?.unitPrice?.message}>
                    <input type="number" step="0.01" className="field-input" {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })} />
                  </Field>
                  <Field label="Discount %" error={form.formState.errors.items?.[index]?.discount?.message}>
                    <input type="number" step="0.01" className="field-input" {...form.register(`items.${index}.discount`, { valueAsNumber: true })} />
                  </Field>
                  <Field label="GST rate" error={form.formState.errors.items?.[index]?.gstRate?.message}>
                    <select className="field-input" {...form.register(`items.${index}.gstRate`, { valueAsNumber: true })}>
                      {[0, 5, 12, 18, 28].map((rate) => (
                        <option key={rate} value={rate}>
                          {rate}%
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Tax type" error={form.formState.errors.items?.[index]?.taxType?.message}>
                    <select className="field-input" {...form.register(`items.${index}.taxType`)}>
                      <option value="intra">CGST + SGST</option>
                      <option value="inter">IGST</option>
                    </select>
                  </Field>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="danger"
                      className="w-full"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Notes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Notes">
              <textarea className="field-input min-h-24" {...form.register("notes")} />
            </Field>
            <Field label="Terms & conditions">
              <textarea className="field-input min-h-24" {...form.register("terms")} />
            </Field>
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <Button type="submit" className="shadow-soft">
            <Save className="size-4" /> Save invoice
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  wide = false,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}) {
  return (
    <label className={`${wide ? "md:col-span-2" : ""} ${className}`}>
      <span className="field-label">{label}</span>
      {children}
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}
