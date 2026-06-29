"use client";

import { ChevronDown, ChevronUp, Pencil, Trash2 } from "lucide-react";
import type { UserType } from "app/types/user";

interface UserRowProps {
  user: UserType;
  onEdit: (user: UserType) => void;
  onDelete: (id: string) => void;
}

export default function UserRow({
  user,
  onEdit,
  onDelete,
}: UserRowProps) {
  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
      {/* Name */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
            {user.name.charAt(0)}
          </div>

          <span className="font-semibold text-slate-900 dark:text-white">
            {user.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">
        {user.email}
      </td>

      {/* Role */}
      <td className="py-4 px-6">
        <span
          className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
          ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {user.role}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              user.isActive ? "bg-emerald-500" : "bg-red-500"
            }`}
          />

          <span
            className={`text-sm font-medium ${
              user.isActive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-4 px-6">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(user._id)}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}