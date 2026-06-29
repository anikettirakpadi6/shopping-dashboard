"use client";

import {
  MapPin,
  Package,
  CreditCard,
} from "lucide-react";

import StatusPill from "./StatusPill";
import { Order } from "@/app/hooks/useOrders";

interface OrderRowProps {
  order: Order;
  onStatusChange: (
    orderId: string,
    status: Order["status"]
  ) => void;
}

export default function OrderRow({
  order,
  onStatusChange,
}: OrderRowProps) {
  return (
    <tr className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
      {/* ID */}
      <td className="py-6 px-6 align-top">
        <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {order._id.slice(-6).toUpperCase()}
        </span>
      </td>

      {/* CUSTOMER */}
      <td className="py-6 px-6 align-top">
        <div className="font-bold text-slate-900 dark:text-white">
          {order.user?.name || "Guest User"}
        </div>

        <div className="flex items-start gap-1 mt-1 text-slate-500 text-xs italic line-clamp-1">
          <MapPin
            size={12}
            className="mt-0.5 shrink-0"
          />
          {order.address}
        </div>
      </td>

      {/* ITEMS */}
      <td className="py-6 px-6 align-top">
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2"
            >
              <Package
                size={14}
                className="text-slate-300 dark:text-slate-600"
              />

              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {item.name}
              </span>

              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 rounded">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>
      </td>

      {/* FINANCE */}
      <td className="py-6 px-6 align-top">
        <div className="font-black text-slate-900 dark:text-white text-base">
          ₹{order.totalAmount.toLocaleString()}
        </div>

        <div
          className={`text-[10px] font-bold uppercase mt-1 inline-flex items-center gap-1 ${
            order.paymentStatus === "paid"
              ? "text-emerald-500"
              : "text-rose-500"
          }`}
        >
          <CreditCard size={10} />
          {order.paymentStatus}
        </div>
      </td>

      {/* STATUS */}
      <td className="py-6 px-6 align-top">
        <div className="flex flex-col gap-3">
          <StatusPill status={order.status} />

          <select
            value={order.status}
            onChange={(e) =>
              onStatusChange(
                order._id,
                e.target.value as Order["status"]
              )
            }
            className="text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-2 py-1 outline-none"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </td>

      {/* DATE */}
      <td className="py-6 px-6 align-top text-right font-medium text-slate-400 text-xs">
        {new Date(order.createdAt).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "short",
          }
        )}
      </td>
    </tr>
  );
}