export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  isActive: boolean;
  password?: string;
}

export type UserSortKey =
  | "name"
  | "email"
  | "role"
  | "isActive";