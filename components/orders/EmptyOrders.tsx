"use client";

import { CheckCircle2 } from "lucide-react";

export default function EmptyOrders() {
  return (
    <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md mx-auto mt-12">
      <CheckCircle2
        className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
        size={40}
      />

      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
        No orders yet
      </h3>

      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
        Any purchases you fulfill inside the store tracker will populate logs
        here.
      </p>
    </div>
  );
}