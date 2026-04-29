import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  LinkIcon,
  Mail,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const features = [
  "GSTIN, HSN/SAC, state code, due date, and buyer details",
  "CGST + SGST or IGST tax handling with automatic totals",
  "Profile defaults for faster invoice creation",
  "A4-ready PDF download and local invoice history",
];

const workflow = [
  { title: "Create account", text: "Signup once and save your default business details in profile settings." },
  { title: "Generate invoice", text: "Fill buyer and item details while GST, discounts, and totals calculate automatically." },
  { title: "Download PDF", text: "Preview saved invoices and export clean printable tax invoice PDFs anytime." },
];

const contactLinks = [
  { label: "Email", value: "contact.rahulatoliya@gmail.com", href: "mailto:contact.rahulatoliya@gmail.com", icon: Mail },
  { label: "Phone", value: "+91 96445 01885", href: "tel:+919644501885", icon: PhoneCall },
  { label: "LinkedIn", value: "linkedin.com/in/rahul-atoliya", href: "https://linkedin.com/in/rahul-atoliya", icon: LinkIcon },
  { label: "GitHub", value: "github.com/rahulatoliya", href: "https://github.com/rahulatoliya", icon: Code2 },
];

export default function LandingPage() {
  return (
    <div className="bg-[#f6f8f5]">
      <section className="container-page grid items-center gap-8 py-8 sm:py-10 lg:min-h-[calc(100vh-190px)] lg:grid-cols-[1fr_520px]">
        <div className="max-w-3xl">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 sm:text-sm">
            <Sparkles className="size-4" />
            Built for Indian GST invoices
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            Create professional GST invoices in minutes
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            A modern invoice workspace for Indian businesses to create tax invoices, manage local invoice history, and download clean A4 PDFs without setting up a backend.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                Start free <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 text-sm font-medium text-stone-700">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="panel overflow-hidden border-stone-300">
            <div className="border-b border-stone-200 bg-white px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-mint">Tax Invoice</p>
                  <h2 className="mt-1 text-xl font-black text-ink">Rahul Trading Co.</h2>
                </div>
                <div className="w-fit rounded-md bg-mint px-3 py-2 text-sm font-bold text-white">GST-204826</div>
              </div>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Taxable" value={formatCurrency(47500)} />
                <Metric label="GST" value={formatCurrency(8550)} />
                <Metric label="Total" value={formatCurrency(56050)} />
              </div>

              <div className="overflow-hidden rounded-lg border border-stone-200">
                <div className="grid grid-cols-[1.4fr_0.55fr_0.9fr] gap-2 bg-stone-50 px-3 py-3 text-xs font-bold uppercase text-stone-500 sm:px-4">
                  <span>Item</span>
                  <span className="text-right">GST</span>
                  <span className="text-right">Amount</span>
                </div>
                {[
                  ["Software subscription", "18%", formatCurrency(29500)],
                  ["Implementation service", "18%", formatCurrency(26550)],
                  ["Support retainer", "12%", formatCurrency(8960)],
                ].map(([name, gst, total]) => (
                  <div key={name} className="grid grid-cols-[1.4fr_0.55fr_0.9fr] gap-2 border-t border-stone-200 px-3 py-3 text-sm sm:px-4">
                    <span className="min-w-0 font-semibold text-stone-800">{name}</span>
                    <span className="text-right text-stone-600">{gst}</span>
                    <span className="text-right font-bold text-ink">{total}</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <BadgeIndianRupee className="size-5 text-amber-700" />
                  <p className="mt-2 text-sm font-bold text-amber-900">Amount in words</p>
                  <p className="mt-1 text-sm text-amber-900">Fifty Six Thousand Fifty rupees only</p>
                </div>
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <Download className="size-5 text-mint" />
                  <p className="mt-2 text-sm font-bold text-teal-950">PDF ready</p>
                  <p className="mt-1 text-sm text-teal-900">GST-Invoice-GST-204826.pdf</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="container-page grid gap-5 py-8 md:grid-cols-3">
          {workflow.map((item, index) => (
            <div key={item.title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-mint text-sm font-black text-white">{index + 1}</span>
              <div>
                <h3 className="font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-4 py-10 md:grid-cols-3">
        <InfoCard icon={<FileText className="size-5" />} title="Indian GST format" text="Capture seller, buyer, supply, HSN/SAC, discounts, GST rates, and tax type in one clean form." />
        <InfoCard icon={<ShieldCheck className="size-5" />} title="Private by default" text="Your demo data stays in browser LocalStorage until you choose a backend later." />
        <InfoCard icon={<Download className="size-5" />} title="Printable PDF" text="Download saved invoices again with an A4-friendly tax invoice layout." />
      </section>

      <section className="border-t border-stone-200 bg-white">
        <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-mint">Contact us</p>
            <h2 className="mt-2 text-2xl font-black text-ink sm:text-3xl">Let us discuss your customized software development</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Need a custom invoice system, business dashboard, CRM, billing workflow, or automation for your company? Contact Rahul Atoliya for further development.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {contactLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex min-w-0 items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 p-4 transition hover:border-mint hover:bg-white"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-mint text-white">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-wider text-stone-500">{item.label}</span>
                    <span className="mt-1 block break-words text-sm font-bold text-ink">{item.value}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-black text-ink">{value}</p>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="panel p-5">
      <span className="grid size-10 place-items-center rounded-md bg-amber-100 text-amber-700">{icon}</span>
      <h3 className="mt-4 text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </div>
  );
}
