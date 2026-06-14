import React from 'react';

interface OrderCardProps {
  order: {
    _id: string;
    createdAt: string | Date;
    status?: string;
    totalAmount: number;
    items?: Array<{
      image?: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    payment?: {
      method?: string;
    };
    address?: string;
  };
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const isCompleted =
    order.status?.toLowerCase() === "delivered" ||
    order.status?.toLowerCase() === "completed";

  const isPending =
    order.status?.toLowerCase() === "pending" ||
    order.status?.toLowerCase() === "processing";

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden animate-in fade-in-50 duration-200">
      
      {/* CARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Order ID
          </p>
          <p className="font-mono text-sm text-slate-900 dark:text-white mt-1">
            {order._id}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          {/* BADGE COMPONENT */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                : isPending
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCompleted
                  ? "bg-emerald-500"
                  : isPending
                    ? "bg-amber-500"
                    : "bg-slate-400"
              }`}
            />
            {order.status}
          </span>

          <p className="text-xl font-bold text-slate-900 dark:text-white">
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* LINE ITEMS BLOCK */}
      <div className="p-5 space-y-4 divide-y divide-slate-50 dark:divide-slate-800/50">
        {order.items?.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-4 pt-4 first:pt-0">
            {/* THUMBNAIL WRAPPER */}
            <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 flex-shrink-0">
              <img
                src={
                  item.image && !item.image.startsWith("blob:")
                    ? item.image
                    : "https://via.placeholder.com/150"
                }
                alt={item.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </div>

            {/* DESCRIPTION META */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {item.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                <span>Qty: {item.quantity}</span>
                <span>₹{item.price.toLocaleString("en-IN")} each</span>
              </div>
            </div>

            {/* EXTENDED PRICE */}
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-slate-900 dark:text-white">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CARD METRICS FOOTER */}
      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Payment Method:
          <span className="ml-2 font-medium text-slate-900 dark:text-white capitalize">
            {order.payment?.method || "N/A"}
          </span>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">
          Shipping Address:
          <span className="ml-2 font-medium text-slate-900 dark:text-white">
            {order.address}
          </span>
        </div>
      </div>

    </div>
  );
};