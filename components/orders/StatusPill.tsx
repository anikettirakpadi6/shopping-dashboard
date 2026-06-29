"use client";

import { Order } from "@/app/hooks/useOrders";

interface StatusPillProps {
  status: Order["status"];
}

const STATUS_CONFIG = {
  pending: {
    className:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    label: "Pending",
  },

  processing: {
    className:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    label: "Processing",
  },

  completed: {
    className:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    label: "Completed",
  },

  cancelled: {
    className:
      "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    label: "Cancelled",
  },
};

export default function StatusPill({
  status,
}: StatusPillProps) {
  const current =
    STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit ${current.className}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {current.label}
    </span>
  );
}