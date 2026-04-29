export type GstRate = 0 | 5 | 12 | 18 | 28;
export type TaxType = "intra" | "inter";

export interface InvoiceItem {
  id: string;
  name: string;
  hsnSac: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  gstRate: GstRate;
  taxType: TaxType;
}

export interface Invoice {
  id: string;
  sellerBusinessName: string;
  sellerGstin: string;
  sellerAddress: string;
  sellerContact: string;
  sellerLogoDataUrl?: string;
  buyerName: string;
  buyerGstin: string;
  buyerAddress: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupply: string;
  stateCode: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItemCalculation {
  lineAmount: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  total: number;
}

export interface InvoiceCalculation {
  items: InvoiceItemCalculation[];
  subtotal: number;
  discountTotal: number;
  taxableTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  totalGst: number;
  grandTotal: number;
  amountInWords: string;
}
