export default function Skeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-[400px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}