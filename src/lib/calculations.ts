import type { Invoice, InvoiceCalculation, InvoiceItem } from "@/types/invoice";

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateItem(item: InvoiceItem) {
  const lineAmount = item.quantity * item.unitPrice;
  const discountAmount = lineAmount * (item.discount / 100);
  const taxableAmount = Math.max(lineAmount - discountAmount, 0);
  const gstAmount = taxableAmount * (item.gstRate / 100);
  const cgst = item.taxType === "intra" ? gstAmount / 2 : 0;
  const sgst = item.taxType === "intra" ? gstAmount / 2 : 0;
  const igst = item.taxType === "inter" ? gstAmount : 0;

  return {
    lineAmount: roundMoney(lineAmount),
    discountAmount: roundMoney(discountAmount),
    taxableAmount: roundMoney(taxableAmount),
    cgst: roundMoney(cgst),
    sgst: roundMoney(sgst),
    igst: roundMoney(igst),
    totalGst: roundMoney(gstAmount),
    total: roundMoney(taxableAmount + gstAmount),
  };
}

export function calculateInvoice(invoice: Pick<Invoice, "items">): InvoiceCalculation {
  const items = invoice.items.map(calculateItem);

  const totals = items.reduce(
    (acc, item) => ({
      subtotal: acc.subtotal + item.lineAmount,
      discountTotal: acc.discountTotal + item.discountAmount,
      taxableTotal: acc.taxableTotal + item.taxableAmount,
      cgstTotal: acc.cgstTotal + item.cgst,
      sgstTotal: acc.sgstTotal + item.sgst,
      igstTotal: acc.igstTotal + item.igst,
      totalGst: acc.totalGst + item.totalGst,
      grandTotal: acc.grandTotal + item.total,
    }),
    {
      subtotal: 0,
      discountTotal: 0,
      taxableTotal: 0,
      cgstTotal: 0,
      sgstTotal: 0,
      igstTotal: 0,
      totalGst: 0,
      grandTotal: 0,
    },
  );

  const grandTotal = roundMoney(totals.grandTotal);

  return {
    items,
    subtotal: roundMoney(totals.subtotal),
    discountTotal: roundMoney(totals.discountTotal),
    taxableTotal: roundMoney(totals.taxableTotal),
    cgstTotal: roundMoney(totals.cgstTotal),
    sgstTotal: roundMoney(totals.sgstTotal),
    igstTotal: roundMoney(totals.igstTotal),
    totalGst: roundMoney(totals.totalGst),
    grandTotal,
    amountInWords: `${numberToIndianWords(Math.round(grandTotal))} rupees only`,
  };
}

const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function twoDigitsToWords(value: number) {
  if (value < 20) return ones[value];
  return `${tens[Math.floor(value / 10)]} ${ones[value % 10]}`.trim();
}

function threeDigitsToWords(value: number) {
  const hundred = Math.floor(value / 100);
  const rest = value % 100;
  return `${hundred ? `${ones[hundred]} hundred` : ""} ${rest ? twoDigitsToWords(rest) : ""}`.trim();
}

export function numberToIndianWords(value: number) {
  if (value === 0) return "zero";

  const crore = Math.floor(value / 10000000);
  const lakh = Math.floor((value % 10000000) / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const rest = value % 1000;

  return [
    crore ? `${twoDigitsToWords(crore)} crore` : "",
    lakh ? `${twoDigitsToWords(lakh)} lakh` : "",
    thousand ? `${twoDigitsToWords(thousand)} thousand` : "",
    rest ? threeDigitsToWords(rest) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
