import { Clock } from "lucide-react";

type ActivityItem = {
  type: string;
  text: string;
  val: string;
  time: string;
};

type Props = {
  items: ActivityItem[];
};

export default function ActivityFeed({ items }: Props) {
  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <Clock size={16} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {item.text}
            </p>

            <p className="text-xs text-slate-500">
              {item.time && !isNaN(new Date(item.time).getTime())
                ? new Date(item.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now"}
            </p>
          </div>

          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
            {item.val}
          </span>
        </div>
      ))}
    </div>
  );
}