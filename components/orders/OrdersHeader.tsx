"use client";

import { RefreshCw, ShoppingBag } from "lucide-react";

interface OrdersHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export default function OrdersHeader({
  loading,
  onRefresh,
}: OrdersHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      <div className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
          <ShoppingBag size={24} strokeWidth={2} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Orders Management
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Track fulfillment states, clear incoming payments, and orchestrate
            shipping logistics.
          </p>
        </div>
      </div>

      <button
        onClick={onRefresh}
        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
      >
        <RefreshCw
          size={20}
          className={loading ? "animate-spin" : ""}
        />
      </button>
    </div>
  );
}