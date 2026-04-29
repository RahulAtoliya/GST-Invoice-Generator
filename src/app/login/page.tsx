"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      loginUser({ email, password });
      toast.success("Logged in successfully");
      router.push("/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to login");
    }
  }

  return (
    <div className="container-page">
      <section className="mx-auto max-w-md panel p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-mint">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Login</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label>
            <span className="field-label">Email</span>
            <input className="field-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span className="field-label">Password</span>
            <input className="field-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <Button type="submit" className="w-full">
            <LogIn className="size-4" /> Login
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-stone-600">
          New here?{" "}
          <Link href="/signup" className="font-bold text-mint">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}
