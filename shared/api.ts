export interface User {
  id: string;
  name: string;
  email: string;
  role: "landlord" | "tenant" | "guest";
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Property {
  id: string;
  companyId: string;
  name: string;
  address: string;
  type: string;
  units: number;
  monthlyRent: number;
  status: "active" | "vacant" | "maintenance";
}

export interface Tenant {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  leaseEndDate?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
}

export interface Document {
  id: string;
  propertyId?: string;
  tenantId?: string;
  name: string;
  url: string;
  type: string;
  aiAnalysis?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
