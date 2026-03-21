import type { UserRole } from "@/types/user";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
