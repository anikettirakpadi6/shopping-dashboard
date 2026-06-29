"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import UserRow from "./UserRow";
import type { UserType } from "app/hooks/useUsers";

interface UsersTableProps {
  loading: boolean;
  users: UserType[];

  sortKey: keyof UserType | null;
  sortOrder: "asc" | "desc";

  onSort: (key: keyof UserType) => void;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
}

export default function UsersTable({
  loading,
  users,
  sortKey,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
          <th
            className="py-4 px-6 font-semibold cursor-pointer"
            onClick={() => onSort("name")}
          >
            <div className="flex items-center gap-2">
              Name

              {sortKey === "name" &&
                (sortOrder === "asc" ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                ))}
            </div>
          </th>

          <th className="py-4 px-6 font-semibold">Email</th>

          <th className="py-4 px-6 font-semibold">Role</th>

          <th className="py-4 px-6 font-semibold">Status</th>

          <th className="py-4 px-6 font-semibold text-right">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {loading
          ? [...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td colSpan={5} className="py-6 px-6">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                </td>
              </tr>
            ))
          : users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
      </tbody>
    </table>
  );
}