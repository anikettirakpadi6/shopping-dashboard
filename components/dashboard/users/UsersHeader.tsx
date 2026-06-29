"use client";

import { Users, UserPlus } from "lucide-react";

interface UsersHeaderProps {
  onAddUser: () => void;
}

export default function UsersHeader({
  onAddUser,
}: UsersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        {/* Icon */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
          <Users size={24} strokeWidth={2} />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User Management
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Manage team permissions, invite new members, and monitor user
            activity.
          </p>
        </div>
      </div>

      <button
        onClick={onAddUser}
        className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
      >
        <UserPlus size={18} />
        <span>Add New User</span>
      </button>
    </div>
  );
}