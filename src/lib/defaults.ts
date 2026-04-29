import type { UserProfile } from "@/types/auth";

export const emptyProfile: UserProfile = {
  businessName: "",
  gstin: "",
  address: "",
  contact: "",
  logoDataUrl: "",
  defaultPlaceOfSupply: "",
  defaultStateCode: "",
  defaultTerms: "Payment due within 15 days. Subject to applicable GST rules.",
};
