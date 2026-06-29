import { Edit3, Trash2 } from "lucide-react";
import type { Product } from "@/app/hooks/useProducts";

type Props = {
  product: Product;
  selected: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  registerRef: (el: HTMLDivElement | null) => void;
};

export default function ProductCard({
  product,
  selected,
  onEdit,
  onDelete,
  registerRef,
}: Props) {
  return (
    <div
      ref={registerRef}
      className={`
        group relative
        bg-white dark:bg-slate-900
        border
        p-4
        rounded-[2rem]
        shadow-sm
        hover:shadow-xl
        dark:hover:shadow-white/5
        transition-all duration-500
        min-h-[380px]
        flex flex-col justify-between

        ${
          selected
            ? "ring-4 ring-blue-500 bg-blue-50 dark:bg-slate-800 scale-[1.02]"
            : "border-slate-200 dark:border-slate-800"
        }
      `}
    >
      <div>
        <div className="relative h-48 w-full bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] mb-4 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center p-3">
          <img
            src={
              product.image && !product.image.startsWith("blob:")
                ? product.image
                : "https://via.placeholder.com/300"
            }
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            {typeof product.categoryId === "object"
              ? product.categoryId?.name
              : "General"}
          </div>

          {product.quantity === 0 && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs px-2.5 py-1 font-bold rounded-full uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="px-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
            {product.name}
          </h3>
        </div>
      </div>

      <div className="px-1 mt-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
              ₹{product.price}
            </p>

            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.quantity < 5
                    ? "bg-red-500 animate-pulse"
                    : "bg-emerald-500"
                }`}
              />

              <p
                className={`text-xs font-bold ${
                  product.quantity < 5
                    ? "text-red-500"
                    : "text-slate-500"
                }`}
              >
                Stock: {product.quantity}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all shadow-sm"
            >
              <Edit3 size={18} />
            </button>

            <button
              onClick={() => onDelete(product._id)}
              className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}