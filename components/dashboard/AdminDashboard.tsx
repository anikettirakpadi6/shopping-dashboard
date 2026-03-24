function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-sm hover:shadow-md transition">
      <h2 className="text-sm font-medium text-black">{title}</h2>
      <p className="text-2xl font-bold mt-2 text-black">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Revenue" value="₹1,20,000" />
        <Card title="Orders" value="320" />
        <Card title="Users" value="150" />
        <Card title="Pending Tasks" value="12" />
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-3 gap-4">
        {/* CHART */}
        <div className="col-span-2 bg-white p-5 rounded-2xl border border-black/10">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Sales Overview
          </h2>

          <div className="h-64 flex items-center justify-center border border-dashed border-black/20 rounded-lg">
            <span className="text-black font-medium">Chart</span>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="bg-white p-5 rounded-2xl border border-black/10">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Recent Activity
          </h2>

          <ul className="space-y-3 text-sm text-black">
            <li className="border-b pb-2">New user registered</li>
            <li className="border-b pb-2">Order #1234 placed</li>
            <li>Payment received</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
