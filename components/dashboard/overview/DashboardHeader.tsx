import { LayoutDashboard } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
        <LayoutDashboard size={24} strokeWidth={2} />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
          Real-time performance metrics, operational updates, and store
          insights.
        </p>
      </div>
    </header>
  );
}