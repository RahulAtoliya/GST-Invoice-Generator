import { z } from "zod";

const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const invoiceItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Item or service name is required"),
  hsnSac: z.string().min(2, "HSN/SAC code is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unitPrice: z.coerce.number().nonnegative("Unit price cannot be negative"),
  discount: z.coerce.number().min(0).max(100, "Discount must be 100% or less"),
  gstRate: z.coerce.number().refine((value) => [0, 5, 12, 18, 28].includes(value), "Select a valid GST rate"),
  taxType: z.enum(["intra", "inter"]),
});

export const invoiceSchema = z.object({
  id: z.string().min(1),
  sellerBusinessName: z.string().min(2, "Seller business name is required"),
  sellerGstin: z.string().regex(gstinRegex, "Enter a valid GSTIN"),
  sellerAddress: z.string().min(8, "Seller address is required"),
  sellerContact: z.string().min(5, "Seller phone or email is required"),
  sellerLogoDataUrl: z.string().optional(),
  buyerName: z.string().min(2, "Buyer name is required"),
  buyerGstin: z.string().regex(gstinRegex, "Enter a valid GSTIN"),
  buyerAddress: z.string().min(8, "Buyer address is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  placeOfSupply: z.string().min(2, "Place of supply is required"),
  stateCode: z.string().regex(/^[0-9]{2}$/, "Use a 2-digit GST state code"),
  items: z.array(invoiceItemSchema).min(1, "Add at least one item"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
export type InvoiceFormInput = z.input<typeof invoiceSchema>;
