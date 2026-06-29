import { ArrowUpRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
            {value}
          </h3>

          {trend && (
            <div className="flex items-center mt-2 text-xs font-medium text-emerald-600">
              <ArrowUpRight size={14} className="mr-1" />
              <span>{trend}% from last month</span>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-900 dark:bg-white rounded-xl">
          <Icon size={20} className="text-white dark:text-slate-900" />
        </div>
      </div>
    </div>
  );
}