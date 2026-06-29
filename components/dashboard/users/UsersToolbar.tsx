"use client";

import { Search } from "lucide-react";

interface UsersToolbarProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function UsersToolbar({
  search,
  setSearch,
}: UsersToolbarProps) {
  return (
    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
        />
      </div>
    </div>
  );
}