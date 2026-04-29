"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signUpUser } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      signUpUser({ name, email, password });
      toast.success("Account created");
      router.push("/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account");
    }
  }

  return (
    <div className="container-page">
      <section className="mx-auto max-w-md panel p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-mint">Create workspace</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Signup</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label>
            <span className="field-label">Name</span>
            <input className="field-input" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label>
            <span className="field-label">Email</span>
            <input className="field-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span className="field-label">Password</span>
            <input className="field-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <Button type="submit" className="w-full">
            <UserPlus className="size-4" /> Signup
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-mint">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}
