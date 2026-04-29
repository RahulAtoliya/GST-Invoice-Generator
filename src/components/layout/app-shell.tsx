"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FilePlus2, Files, Home, LayoutDashboard, LockKeyhole, LogIn, LogOut, Settings, Shield, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ADMIN_CHANGE_EVENT, getAdminSession, logoutAdmin } from "@/lib/admin";
import { AUTH_CHANGE_EVENT, getCurrentUser, logoutUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AdminSession, UserAccount } from "@/types/auth";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: Files },
  { href: "/invoices/new", label: "New Invoice", icon: FilePlus2 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [admin, setAdmin] = useState<AdminSession | null>(null);

  useEffect(() => {
    const syncUser = async () => setUser(await getCurrentUser());
    const syncAdmin = () => setAdmin(getAdminSession());
    syncUser();
    syncAdmin();
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener(ADMIN_CHANGE_EVENT, syncAdmin);
    window.addEventListener("storage", syncUser);
    window.addEventListener("storage", syncAdmin);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener(ADMIN_CHANGE_EVENT, syncAdmin);
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("storage", syncAdmin);
    };
  }, []);

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  function handleAdminLogout() {
    logoutAdmin();
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8f5]">
      <header className="border-b border-stone-200 bg-white">
        <div className="container-page flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-mint text-sm font-black text-white sm:size-10">Rs</span>
            <span className="min-w-0">
              <span className="block truncate text-base font-bold text-ink sm:text-lg">GST Invoice Generator</span>
              <span className="block text-xs font-medium text-stone-500">Indian tax invoice workspace</span>
            </span>
          </Link>

          <nav className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 lg:mx-0 lg:flex-wrap lg:justify-end lg:overflow-visible lg:px-0 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                    active ? "bg-mint text-white" : "text-stone-700 hover:bg-stone-100",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                    pathname === "/profile" ? "bg-mint text-white" : "text-stone-700 hover:bg-stone-100",
                  )}
                >
                  <Settings className="size-4" aria-hidden="true" />
                  Profile
                </Link>
                <Button type="button" variant="ghost" className="shrink-0 px-3" onClick={handleLogout}>
                  <LogOut className="size-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                    pathname === "/login" ? "bg-mint text-white" : "text-stone-700 hover:bg-stone-100",
                  )}
                >
                  <LogIn className="size-4" aria-hidden="true" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                    pathname === "/signup" ? "bg-mint text-white" : "text-stone-700 hover:bg-stone-100",
                  )}
                >
                  <UserPlus className="size-4" aria-hidden="true" />
                  Signup
                </Link>
              </>
            )}
            {admin ? (
              <>
                <Link
                  href="/admin"
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                    pathname === "/admin" ? "bg-mint text-white" : "text-stone-700 hover:bg-stone-100",
                  )}
                >
                  <Shield className="size-4" aria-hidden="true" />
                  Admin
                </Link>
                <Button type="button" variant="ghost" className="shrink-0 px-3" onClick={handleAdminLogout}>
                  <LogOut className="size-4" /> Admin logout
                </Button>
              </>
            ) : (
              <Link
                href="/admin/login"
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                  pathname === "/admin/login" ? "bg-mint text-white" : "text-stone-700 hover:bg-stone-100",
                )}
              >
                <LockKeyhole className="size-4" aria-hidden="true" />
                Admin
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200 bg-white">
        <div className="container-page py-4 text-center text-sm font-medium text-stone-500">
          Created by Rahul Atoliya
        </div>
      </footer>
    </div>
  );
}
