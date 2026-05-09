import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
};

export default function DeleteConfirm({
  onConfirm,
  onCancel,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this user? This action cannot be undone.",
}: Props) {
  // Prevent background scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl w-full max-w-[360px] shadow-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ICON & TITLE */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-500/10 flex items-center justify-center rounded-xl">
            <AlertTriangle
              className="text-red-600 dark:text-red-500"
              size={22}
            />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>

        {/* MESSAGE */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="order-2 sm:order-1 flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="order-1 sm:order-2 flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-sm font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
