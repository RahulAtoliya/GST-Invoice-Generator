"use client";

import jsPDF from "jspdf";
import { calculateInvoice } from "@/lib/calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

const page = {
  margin: 12,
  contentWidth: 186,
};

function pdfCurrency(value: number) {
  return formatCurrency(value).replace(/[₹â‚¹]/g, "Rs ");
}

function imageFormat(dataUrl: string) {
  if (dataUrl.includes("image/png")) return "PNG";
  if (dataUrl.includes("image/webp")) return "WEBP";
  return "JPEG";
}

export function downloadInvoicePdf(invoice: Invoice) {
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const calc = calculateInvoice(invoice);
  let y = 14;

  const setText = (size = 9, bold = false, color: [number, number, number] = [31, 41, 55]) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(...color);
  };

  const text = (value: string, x: number, lineY: number, options?: { size?: number; bold?: boolean; maxWidth?: number; color?: [number, number, number] }) => {
    setText(options?.size, options?.bold, options?.color);
    pdf.text(value || "-", x, lineY, { maxWidth: options?.maxWidth });
  };

  const rightText = (value: string, x: number, lineY: number, options?: { size?: number; bold?: boolean; color?: [number, number, number] }) => {
    setText(options?.size, options?.bold, options?.color);
    pdf.text(value || "-", x, lineY, { align: "right" });
  };

  const ensureSpace = (needed: number) => {
    if (y + needed < 270) return;
    pdf.addPage();
    y = 16;
  };

  const drawPageBorder = () => {
    pdf.setDrawColor(15, 118, 110);
    pdf.setLineWidth(0.35);
    pdf.rect(page.margin, 10, page.contentWidth, 277);
  };

  const drawHeader = () => {
    drawPageBorder();

    pdf.setFillColor(15, 118, 110);
    pdf.rect(page.margin, 10, page.contentWidth, 14, "F");
    text("TAX INVOICE", 105, 19, { size: 16, bold: true, color: [255, 255, 255] });

    y = 33;
    if (invoice.sellerLogoDataUrl) {
      try {
        pdf.addImage(invoice.sellerLogoDataUrl, imageFormat(invoice.sellerLogoDataUrl), page.margin + 4, y - 3, 22, 22);
      } catch {
        // Ignore unsupported image data and continue with a text-only invoice.
      }
    }

    const sellerX = invoice.sellerLogoDataUrl ? page.margin + 31 : page.margin + 4;
    text(invoice.sellerBusinessName, sellerX, y, { size: 14, bold: true, maxWidth: 92 });
    text(invoice.sellerAddress, sellerX, y + 6, { size: 8.5, maxWidth: 92 });
    text(`GSTIN: ${invoice.sellerGstin}`, sellerX, y + 18, { bold: true });
    text(invoice.sellerContact, sellerX, y + 24, { size: 8.5, maxWidth: 92 });

    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(136, y - 4, 58, 34, 2, 2);
    text("Invoice No.", 140, y + 2, { size: 8, color: [100, 116, 139] });
    text(invoice.invoiceNumber, 164, y + 2, { bold: true, maxWidth: 28 });
    text("Invoice Date", 140, y + 10, { size: 8, color: [100, 116, 139] });
    text(formatDate(invoice.invoiceDate), 164, y + 10, { bold: true });
    text("Due Date", 140, y + 18, { size: 8, color: [100, 116, 139] });
    text(formatDate(invoice.dueDate), 164, y + 18, { bold: true });
    text("Supply", 140, y + 26, { size: 8, color: [100, 116, 139] });
    text(`${invoice.placeOfSupply} (${invoice.stateCode})`, 164, y + 26, { bold: true, maxWidth: 28 });

    y += 40;
  };

  drawHeader();

  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(page.margin + 4, y, 88, 30, 2, 2);
  text("BILL TO", page.margin + 8, y + 7, { size: 8, bold: true, color: [15, 118, 110] });
  text(invoice.buyerName, page.margin + 8, y + 14, { size: 11, bold: true, maxWidth: 76 });
  text(invoice.buyerAddress, page.margin + 8, y + 20, { size: 8.5, maxWidth: 76 });
  text(`GSTIN: ${invoice.buyerGstin}`, page.margin + 8, y + 28, { size: 8.5, bold: true });

  pdf.roundedRect(106, y, 88, 30, 2, 2);
  text("AMOUNT IN WORDS", 110, y + 7, { size: 8, bold: true, color: [15, 118, 110] });
  text(calc.amountInWords, 110, y + 15, { size: 8.5, bold: true, maxWidth: 78 });
  y += 40;

  const tableX = page.margin + 2;
  const tableWidth = 182;
  const columns = [
    { label: "Item / Service", x: tableX, w: 58, align: "left" },
    { label: "HSN/SAC", x: tableX + 58, w: 24, align: "left" },
    { label: "Qty", x: tableX + 82, w: 14, align: "right" },
    { label: "Rate", x: tableX + 96, w: 28, align: "right" },
    { label: "GST", x: tableX + 124, w: 20, align: "right" },
    { label: "Total", x: tableX + 144, w: 38, align: "right" },
  ] as const;

  const cellText = (
    value: string,
    column: (typeof columns)[number],
    lineY: number,
    options?: { size?: number; bold?: boolean; maxWidth?: number; color?: [number, number, number] },
  ) => {
    const padding = 2.5;

    if (column.align === "right") {
      rightText(value, column.x + column.w - padding, lineY, options);
      return;
    }

    text(value, column.x + padding, lineY, { ...options, maxWidth: options?.maxWidth ?? column.w - padding * 2 });
  };

  const drawTableHeader = () => {
    pdf.setFillColor(15, 118, 110);
    pdf.rect(tableX, y, tableWidth, 9, "F");
    columns.forEach((column) => cellText(column.label, column, y + 6, { size: 8, bold: true, color: [255, 255, 255] }));
    y += 9;
  };

  drawTableHeader();

  invoice.items.forEach((item, index) => {
    ensureSpace(16);
    if (y === 16) drawTableHeader();

    const itemCalc = calc.items[index];
    const rowHeight = Math.max(11, pdf.splitTextToSize(item.name || "-", columns[0].w - 5).length * 5 + 4);

    pdf.setDrawColor(226, 232, 240);
    pdf.rect(tableX, y, tableWidth, rowHeight);
    columns.slice(1).forEach((column) => {
      pdf.line(column.x, y, column.x, y + rowHeight);
    });

    cellText(item.name || "-", columns[0], y + 6, { size: 8.5, bold: true });
    cellText(item.hsnSac || "-", columns[1], y + 6, { size: 8 });
    cellText(String(item.quantity), columns[2], y + 6, { size: 8 });
    cellText(pdfCurrency(item.unitPrice), columns[3], y + 6, { size: 8 });
    cellText(`${item.gstRate}%`, columns[4], y + 6, { size: 8 });
    cellText(pdfCurrency(itemCalc.total), columns[5], y + 6, { size: 8, bold: true });
    y += rowHeight;
  });

  y += 8;
  ensureSpace(68);

  const notesX = page.margin + 4;
  const totalsX = 122;

  if (invoice.notes || invoice.terms) {
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(notesX, y, 96, 48, 2, 2);
    text("NOTES", notesX + 4, y + 7, { size: 8, bold: true, color: [15, 118, 110] });
    text(invoice.notes || "-", notesX + 4, y + 14, { size: 8, maxWidth: 86 });
    text("TERMS & CONDITIONS", notesX + 4, y + 29, { size: 8, bold: true, color: [15, 118, 110] });
    text(invoice.terms || "-", notesX + 4, y + 36, { size: 8, maxWidth: 86 });
  }

  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(totalsX, y, 72, 61, 2, 2);
  const totalRows = [
    ["Subtotal", calc.subtotal],
    ["Discount", calc.discountTotal],
    ["Taxable Amount", calc.taxableTotal],
    ["CGST", calc.cgstTotal],
    ["SGST", calc.sgstTotal],
    ["IGST", calc.igstTotal],
    ["Total GST", calc.totalGst],
  ] as const;

  let totalY = y + 7;
  totalRows.forEach(([label, value]) => {
    text(label, totalsX + 4, totalY, { size: 8 });
    rightText(pdfCurrency(value), totalsX + 68, totalY, { size: 8 });
    totalY += 6;
  });

  pdf.setFillColor(241, 245, 249);
  pdf.rect(totalsX, y + 48, 72, 13, "F");
  text("Grand Total", totalsX + 4, y + 56, { size: 10, bold: true });
  rightText(pdfCurrency(calc.grandTotal), totalsX + 68, y + 56, { size: 10, bold: true });

  y += 74;
  ensureSpace(18);
  pdf.setDrawColor(148, 163, 184);
  pdf.line(143, y, 194, y);
  text("Authorized Signature", 151, y + 7, { size: 9, bold: true });

  pdf.save(`GST-Invoice-${invoice.invoiceNumber}.pdf`);
}
