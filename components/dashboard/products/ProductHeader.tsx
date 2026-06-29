import { Package, Plus } from "lucide-react";

type Props = {
  onAdd: () => void;
};

export default function ProductHeader({ onAdd }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
          <Package size={24} strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Inventory
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Manage your products, track variant SKUs, and monitor real-time
            stock levels.
          </p>
        </div>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-white/5 hover:scale-105 transition-all active:scale-95"
      >
        <Plus size={20} />
        Add Product
      </button>
    </div>
  );
}