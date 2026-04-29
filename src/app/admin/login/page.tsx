"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ADMIN_EMAIL, ADMIN_PASSWORD, loginAdmin } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      loginAdmin({ email, password });
      toast.success("Admin logged in");
      router.push("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to login as admin");
    }
  }

  return (
    <div className="container-page">
      <section className="mx-auto max-w-md panel p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-mint">Admin access</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Admin login</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label>
            <span className="field-label">Admin email</span>
            <input className="field-input" type="email"  onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span className="field-label">Password</span>
            <input className="field-input" type="password"  onChange={(event) => setPassword(event.target.value)} required />
          </label>
           <br /><br />
          <Button type="submit" className="w-full">
            <LockKeyhole className="size-4" /> Login as admin
          </Button>
        </form>
      </section>
    </div>
  );
}
