"use client";

import { ImagePlus, Save, Trash2 } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Button } from "@/components/ui/button";
import { getCurrentUser, updateCurrentUserProfile } from "@/lib/auth";
import type { UserAccount, UserProfile } from "@/types/auth";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileSettings />
    </AuthGuard>
  );
}

function ProfileSettings() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    businessName: "",
    gstin: "",
    address: "",
    contact: "",
    logoDataUrl: "",
    defaultPlaceOfSupply: "",
    defaultStateCode: "",
    defaultTerms: "",
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setProfile(currentUser.profile);
    }
  }, []);

  function updateField<Key extends keyof UserProfile>(key: Key, value: UserProfile[Key]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const updatedUser = updateCurrentUserProfile({
        ...profile,
        gstin: profile.gstin.toUpperCase(),
      });
      setUser(updatedUser);
      setProfile(updatedUser.profile);
      toast.success("Profile defaults saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save profile");
    }
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 500 * 1024) {
      toast.error("Logo should be under 500 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("logoDataUrl", String(reader.result));
      toast.success("Logo added");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="container-page space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-mint">Profile settings</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Default invoice details</h1>
        <p className="mt-2 text-sm text-stone-600">
          {user ? `${user.name} - ${user.email}` : "Save your default business details for new invoices."}
        </p>
      </div>

      <form className="mx-auto max-w-4xl space-y-6" onSubmit={handleSubmit}>
        <section className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Seller defaults</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 rounded-lg border border-stone-200 bg-stone-50 p-4">
              <span className="field-label">Business logo</span>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid size-20 place-items-center rounded-md border border-stone-300 bg-white">
                  {profile.logoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.logoDataUrl} alt="Business logo preview" className="size-16 object-contain" />
                  ) : (
                    <ImagePlus className="size-7 text-stone-400" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-50">
                    <ImagePlus className="size-4" />
                    Upload logo
                    <input className="sr-only" type="file" accept="image/*" onChange={handleLogoChange} />
                  </label>
                  {profile.logoDataUrl ? (
                    <Button type="button" variant="danger" onClick={() => updateField("logoDataUrl", "")}>
                      <Trash2 className="size-4" /> Remove
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
            <label>
              <span className="field-label">Business name</span>
              <input className="field-input" value={profile.businessName} onChange={(event) => updateField("businessName", event.target.value)} required />
            </label>
            <label>
              <span className="field-label">GSTIN</span>
              <input
                className="field-input uppercase"
                pattern="[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z][1-9A-Za-z]Z[0-9A-Za-z]"
                value={profile.gstin}
                onChange={(event) => updateField("gstin", event.target.value)}
                required
              />
            </label>
            <label>
              <span className="field-label">Phone / email</span>
              <input className="field-input" value={profile.contact} onChange={(event) => updateField("contact", event.target.value)} required />
            </label>
            <label>
              <span className="field-label">Default place of supply</span>
              <input className="field-input" value={profile.defaultPlaceOfSupply} onChange={(event) => updateField("defaultPlaceOfSupply", event.target.value)} />
            </label>
            <label>
              <span className="field-label">Default state code</span>
              <input
                className="field-input"
                maxLength={2}
                pattern="[0-9]{2}"
                value={profile.defaultStateCode}
                onChange={(event) => updateField("defaultStateCode", event.target.value)}
              />
            </label>
            <label className="md:col-span-2">
              <span className="field-label">Business address</span>
              <textarea className="field-input min-h-24" value={profile.address} onChange={(event) => updateField("address", event.target.value)} required />
            </label>
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-lg font-bold text-ink">Invoice defaults</h2>
          <div className="mt-4">
            <label>
              <span className="field-label">Terms & conditions</span>
              <textarea
                className="field-input min-h-24"
                value={profile.defaultTerms}
                onChange={(event) => updateField("defaultTerms", event.target.value)}
              />
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="size-4" /> Save profile
          </Button>
        </div>
      </form>
    </div>
  );
}
