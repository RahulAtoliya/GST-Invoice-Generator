"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getAdminSession } from "@/lib/admin";
import type { AdminSession } from "@/types/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null | undefined>(undefined);

  useEffect(() => {
    setSession(getAdminSession());
  }, []);

  if (session === undefined) {
    return (
      <div className="container-page">
        <div className="panel p-8 text-center text-sm text-stone-600">Loading admin...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container-page">
        <section className="mx-auto max-w-lg panel p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-mint">Admin required</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Login as admin</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">Admin access is required to view users and platform statistics.</p>
          <Link href="/admin/login" className="mt-6 inline-block">
            <Button>Admin login</Button>
          </Link>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
