export interface User {
  id: string;
  auth0Sub: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  created_at: string;
}

export interface CompanyMembership {
  company_id: string;
  company_name: string;
  role: "owner" | "staff" | "tenant";
  status: "active" | "invited" | "disabled";
}

export interface CompanyMember {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: "owner" | "staff" | "tenant";
  status: "active" | "invited" | "disabled";
  created_at: string;
}

export interface Invite {
  id: string;
  company_id: string;
  email: string;
  role: "staff" | "tenant";
  token: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  expires_at: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
}

export interface AuthMeResponse {
  user: User;
  memberships: CompanyMembership[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
