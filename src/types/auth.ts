export interface UserProfile {
  businessName: string;
  gstin: string;
  address: string;
  contact: string;
  logoDataUrl?: string;
  defaultPlaceOfSupply: string;
  defaultStateCode: string;
  defaultTerms: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: UserProfile;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
}

export interface AdminSession {
  email: string;
}
