"use client";

import OrderRow from "./OrderRow";
import { Order } from "@/app/hooks/useOrders";

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onStatusChange: (
    orderId: string,
    status: Order["status"]
  ) => void;
}

export default function OrdersTable({
  orders,
  loading,
  onStatusChange,
}: OrdersTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50">
              <th className="py-5 px-6">Ref ID</th>
              <th className="py-5 px-6">Customer / Shipping</th>
              <th className="py-5 px-6">Order Items</th>
              <th className="py-5 px-6">Finance</th>
              <th className="py-5 px-6">Fulfillment</th>
              <th className="py-5 px-6 text-right">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {!loading &&
              orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onStatusChange={onStatusChange}
                />
              ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-20 text-center text-slate-400 animate-pulse font-medium italic">
            Synchronizing with database...
          </div>
        )}
      </div>
    </div>
  );
}