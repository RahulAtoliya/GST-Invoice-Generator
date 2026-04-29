"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import type { UserAccount } from "@/types/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null | undefined>(undefined);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return (
      <div className="container-page">
        <div className="panel p-8 text-center text-sm text-stone-600">Loading account...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page">
        <section className="mx-auto max-w-lg panel p-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-mint">Login required</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Create your account first</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Login or signup to save profile defaults and keep your invoice history separate.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login">
              <Button className="w-full sm:w-auto">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" className="w-full sm:w-auto">
                Signup
              </Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
