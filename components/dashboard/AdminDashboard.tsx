import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  Plus,
  Edit3,
  Filter,
  ChevronUp,
  ChevronDown,
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
  RefreshCw,
  LucideProps,
} from "lucide-react";
import toast from "react-hot-toast";
import EditUserModal from "@/components/AddEditUserModal";
import ProductModal from "@/components/ProductModal";
import DeleteConfirm from "@/components/DeleteConfirm";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

type Props = {
  activeTab: string;
  isCurrency?: boolean;
};

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  password?: string;
};

// type AnalyticsData = {
//   users: {
//     total: number;
//     active: number;
//   };
//   products: {
//     total: number;
//     lowStock: number;
//     outOfStock: number;
//   };
//   orders: {
//     total: number;
//     revenue: number;
//     pending: number;
//     completed: number;
//   };
// };

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  categoryId: string | Category | null;
};

type Category = {
  _id: string;
  name: string;
};

// type Order = {
//   _id: string;
//   user?: { name: string };
//   products: { name: string; quantity: number }[];
//   totalAmount: number;
//   status: string;
//   createdAt: string;
// };

interface MetricProps {
  label: string;
  value: number;
  icon: React.ReactElement<LucideProps>;
  isCurrency?: boolean;
  color: "emerald" | "blue" | "purple" | "orange";
}

interface HealthProps {
  label: string;
  value: number;
  color: "red" | "orange" | "blue";
}

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  user?: {
    name: string;
    email?: string;
  };
  items: OrderItem[]; // Matches your schema
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  address: string;
  createdAt: string;
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-700 p-5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-colors duration-300">
      <h2 className="text-sm font-medium text-black dark:text-white">
        {title}
      </h2>
      <p className="text-2xl font-bold mt-2 text-black dark:text-white">
        {value}
      </p>
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
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

const Skeleton = () => (
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

export default function AdminDashboard({ activeTab }: Props) {
  if (activeTab === "users") {
    return <UsersSection />;
  }

  if (activeTab === "analytics") {
    return <AnalyticsSection />;
  }

  if (activeTab === "products") {
    return <ProductsSection />;
  }

  if (activeTab === "orders") {
    return <OrdersSection />;
  }

  return <OverviewSection />;

  // Overview Section
  function OverviewSection() {
    const [data, setData] = useState<any>({
      stats: {},
      chart: [],
      activity: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchOverview = async () => {
        try {
          const [oRes, uRes, pRes] = await Promise.all([
            fetch("/api/orders"),
            fetch("/api/users"),
            fetch("/api/products"),
          ]);

          const { orders = [] } = await oRes.json();
          const { users = [] } = await uRes.json();
          const { products = [] } = await pRes.json();

          // Stats Calculation
          const revenue = orders.reduce(
            (sum: number, o: any) => sum + (o.totalAmount || 0),
            0,
          );
          const lowStock = products.filter((p: any) => p.quantity < 5).length;

          // Chart Data Grouping
          const grouped = orders.reduce((acc: any, o: any) => {
            const day = new Date(o.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            });
            acc[day] = (acc[day] || 0) + (o.totalAmount || 0);
            return acc;
          }, {});

          const chart = Object.entries(grouped)
            .map(([day, sales]) => ({ day, sales }))
            .slice(-7); // Last 7 days

          // Activity Feed
          const activity = [
            ...orders.slice(0, 3).map((o: any) => ({
              type: "order",
              text: `Order #...${o.id?.slice(-4)}`,
              val: `₹${o.totalAmount}`,
              time: o.createdAt,
            })),
            ...users.slice(0, 2).map((u: any) => ({
              type: "user",
              text: `New user: ${u.name}`,
              val: "Joined",
              time: u.createdAt || new Date().toISOString(),
            })),
          ].sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
          );

          setData({
            stats: {
              revenue,
              orders: orders.length,
              users: users.length,
              lowStock,
            },
            chart,
            activity,
          });
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchOverview();
    }, []);

    if (loading) return <Skeleton />;

    return (
      <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors">
        <header>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          {/* <p className="text-slate-500 text-sm">Real-time performance metrics for your store.</p> */}
        </header>

        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`₹${data.stats.revenue.toLocaleString()}`}
            icon={TrendingUp}
            trend={12}
          />
          <StatCard
            title="Total Orders"
            value={data.stats.orders}
            icon={ShoppingBag}
            trend={8}
          />
          <StatCard
            title="Total Users"
            value={data.stats.users}
            icon={Users}
            trend={5}
          />
          <StatCard
            title="Low Stock"
            value={data.stats.lowStock}
            icon={AlertCircle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Revenue Trends
              </h2>
              <select className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-md px-2 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chart}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#0f172a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-6">
              {data.activity.map((item: any, i: number) => (
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
            {/* <button className="w-full mt-8 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border-t border-slate-100 dark:border-slate-800">
            View All Activity
          </button> */}
          </div>
        </div>
      </div>
    );
  }

  function UsersSection() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Modal & Selection States ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // --- Filtering States ---
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<keyof UserType | null>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch("/api/users");
          const data = await res.json();
          setUsers(data.users || []);
        } catch (err) {
          toast.error("Failed to load users");
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, []);

    const handleSort = (key: keyof UserType) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    };

    const filteredUsers = useMemo(() => {
      let data = [...users];
      if (search) {
        data = data.filter((u) =>
          `${u.name} ${u.email} ${u.role}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        );
      }
      if (sortKey) {
        data.sort((a, b) => {
          const valA = a[sortKey] ?? "";
          const valB = b[sortKey] ?? "";
          const res =
            typeof valA === "string"
              ? valA.localeCompare(valB as string)
              : Number(valA) - Number(valB);
          return sortOrder === "asc" ? res : -res;
        });
      }
      return data;
    }, [users, search, sortKey, sortOrder]);

    // --- Logic Handlers ---

    const handleOpenAddModal = () => {
      setSelectedUser(null); // No user means "Add Mode"
      setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: UserType) => {
      setSelectedUser(user); // Passing user means "Edit Mode"
      setIsModalOpen(true);
    };

    const handleSaveUser = async (userData: UserType) => {
      try {
        const isNew = !userData._id;
        const url = isNew ? "/api/users" : `/api/users/${userData._id}`;
        const method = isNew ? "POST" : "PUT";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!res.ok) throw new Error();
        const result = await res.json();

        if (isNew) {
          setUsers((prev) => [result.user, ...prev]);
          toast.success("User created successfully");
        } else {
          setUsers((prev) =>
            prev.map((u) => (u._id === userData._id ? result.user : u)),
          );
          toast.success("User updated successfully");
        }

        setIsModalOpen(false);
      } catch (err) {
        toast.error("Operation failed. Please try again.");
      }
    };

    const confirmDelete = async () => {
      if (!deleteId) return;
      try {
        const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        setUsers((prev) => prev.filter((u) => u._id !== deleteId));
        toast.success("User deleted successfully");
      } catch {
        toast.error("Delete failed");
      } finally {
        setDeleteId(null);
      }
    };

    return (
      <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              User Management
            </h1>
            {/* <p className="text-slate-500 text-sm">Manage permissions and view member activity.</p> */}
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
          >
            <UserPlus size={18} />
            <span>Add New User</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, email or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <Filter size={18} />
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th
                  className="py-4 px-6 font-semibold cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Name{" "}
                    {sortKey === "name" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold">Email</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="py-6 px-6">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                : filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 text-sm">
                        {user.email}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider
                    ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : user.role === "employee"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`}
                          />
                          <span
                            className={`text-sm font-medium ${user.isActive ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(user._id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Edit/Add Modal */}
        {isModalOpen && (
          <EditUserModal
            key={selectedUser?._id || "new"} // Forces re-render when switching users
            user={
              selectedUser ?? {
                _id: "",
                name: "",
                email: "",
                role: "employee",
                isActive: true,
              }
            }
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveUser}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Delete User?
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                This action is permanent and cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function AnalyticsSection() {
    const [stats, setStats] = useState<any>({
      users: { total: 0, active: 0 },
      products: { total: 0, lowStock: 0, outOfStock: 0 },
      orders: { total: 0, revenue: 0, pending: 0, completed: 0 },
    });

    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics/summary");
        const data = await res.json();

        setStats(data.stats || {});
        setChartData(data.chart || []);
      } catch (err) {
        console.error("Analytics error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (loading)
      return <div className="p-8 text-slate-500">Loading metrics...</div>;

    return (
      <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
        {/* Header logic same as before... */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Analytics
            </h1>
            {/* <p className="text-slate-500 text-sm mt-1">
              Real-time performance metrics.
            </p> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Total Revenue"
            value={stats.orders.revenue}
            icon={<IndianRupee />}
            isCurrency
            color="emerald"
          />
          <MetricCard
            label="Active Users"
            value={stats.users.total}
            icon={<Users />}
            color="blue"
          />
          <MetricCard
            label="Total Orders"
            value={stats.orders.total}
            icon={<ShoppingCart />}
            color="purple"
          />
          <MetricCard
            label="Inventory"
            value={stats.products.total}
            icon={<Package />}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold mb-8 text-slate-900 dark:text-white">
              Revenue Trend
            </h2>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  {/* Chart implementation same as before... */}
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f172a"
                    fillOpacity={1}
                    fill="url(#colorRev)"
                    className="dark:stroke-white"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Inventory</h2>
              <div className="space-y-4">
                <HealthItem
                  label="Out of Stock"
                  value={stats.products.outOfStock}
                  color="red"
                />
                <HealthItem
                  label="Low Stock"
                  value={stats.products.lowStock}
                  color="orange"
                />
                <HealthItem
                  label="Pending Orders"
                  value={stats.orders.pending}
                  color="blue"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // 2. Extracted Components with Fixed Types
    function MetricCard({
      label,
      value,
      icon,
      isCurrency,
      color,
    }: MetricProps) {
      return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 
            ${color === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : ""}
            ${color === "blue" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : ""}
            ${color === "purple" ? "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" : ""}
            ${color === "orange" ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400" : ""}
          `}
          >
            {/* FIX: Cast to React.ReactElement and pass size as a standard prop */}
            {React.cloneElement(icon, { size: 24 } as LucideProps)}
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {isCurrency
              ? `₹${value?.toLocaleString()}`
              : value?.toLocaleString()}
          </h3>
        </div>
      );
    }

    function HealthItem({ label, value, color }: HealthProps) {
      return (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {label}
          </span>
          <span
            className={`text-lg font-black 
            ${color === "red" ? "text-red-600" : color === "orange" ? "text-orange-600" : "text-blue-600"}
          `}
          >
            {value}
          </span>
        </div>
      );
    }
  }

  function ProductsSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState({
      name: "",
      price: "",
      quantity: "",
      image: "",
      description: "",
      categoryId: "",
    });

    // Fetch data
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pRes, cRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);

        const pData = await pRes.json();
        const cData = await cRes.json();

        setProducts(pData);
        setCategories(cData);
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };

    useEffect(() => {
      fetchData();
    }, []);

    // Submit (Add / Update)
    const handleSubmit = async () => {
      if (!form.name || !form.price) return;
      const isNew = !editingId;
      try {
        const res = await fetch(
          isNew ? "/api/products" : `/api/products/${editingId}`,
          {
            method: isNew ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              price: Number(form.price),
              quantity: Number(form.quantity),
            }),
          },
        );
        const data = await res.json();
        const product = data.product || data;

        if (isNew) {
          setProducts((prev) => [product, ...prev]);
        } else {
          setProducts((prev) =>
            prev.map((p) => (p._id === editingId ? product : p)),
          );
        }
        toast.success(isNew ? "Product added" : "Product updated");
        setShowModal(false);
      } catch (err: any) {
        toast.error(err.message || "Operation failed");
      }
    };

    // Edit
    const handleEdit = (p: Product) => {
      setForm({
        name: p.name || "",
        price: String(p.price) || "",
        quantity: String(p.quantity) || "",
        image: p.image || "",
        description: p.description || "",
        categoryId:
          (typeof p.categoryId === "object"
            ? p.categoryId?._id
            : p.categoryId) || "",
      });
      setEditingId(p._id);
      setImagePreview(p.image && !p.image.startsWith("blob:") ? p.image : "");
      setShowModal(true);
    };

    // Delete
    const confirmDelete = async () => {
      if (!deleteId) return;

      try {
        const res = await fetch(`/api/products/${deleteId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        // REMOVE from list
        setProducts((prev) => prev.filter((p) => p._id !== deleteId));

        toast.success("Product deleted");
        setDeleteId(null);
      } catch (err: any) {
        toast.error(err.message || "Delete failed");
      }
    };

    const cancelDelete = () => {
      setDeleteId(null);
    };

    return (
      <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all duration-500">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {/* <Package className="text-blue-600" size={32} /> */}
              Inventory
            </h2>
            {/* <p className="text-slate-500 text-sm mt-1">
              Manage your products and stock levels.
            </p> */}
          </div>

          <button
            onClick={() => {
              setForm({
                name: "",
                price: "",
                quantity: "",
                image: "",
                description: "",
                categoryId: "",
              });
              setEditingId(null);
              setImagePreview("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg shadow-slate-900/10 dark:shadow-white/5 hover:scale-105 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[380px] bg-slate-200 dark:bg-slate-900 rounded-[2rem]"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
            <ShoppingBag className="text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-medium">
              Your inventory is empty.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-[2rem] shadow-sm hover:shadow-xl dark:hover:shadow-white/5 transition-all duration-300 min-h-[380px] flex flex-col justify-between"
              >
                {/* UPPER WRAPPER (IMAGE + TITLE) */}
                <div>
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-48 w-full bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] mb-4 overflow-hidden border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center p-3">
                    <img
                      src={
                        p?.image && !p.image.startsWith("blob:")
                          ? p.image
                          : "https://via.placeholder.com/300"
                      }
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      alt={p.name}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                      {typeof p.categoryId === "object"
                        ? p.categoryId?.name
                        : "General"}
                    </div>
                    {p.quantity === 0 && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs px-2.5 py-1 font-bold rounded-full uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* TITLE */}
                  <div className="px-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                      {p.name}
                    </h3>
                  </div>
                </div>

                {/* LOWER WRAPPER (PRICE + INLINE ACTIONS) */}
                <div className="px-1 mt-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                        ₹{p.price}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${p.quantity < 5 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`}
                        />
                        <p
                          className={`text-xs font-bold ${p.quantity < 5 ? "text-red-500" : "text-slate-500"}`}
                        >
                          Stock: {p.quantity}
                        </p>
                      </div>
                    </div>

                    {/* ACTION FOOTER BUTTONS */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteId(String(p._id))}
                        className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODALS */}
        <ProductModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          categories={categories}
          editingId={editingId}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        {deleteId && (
          <DeleteConfirm
            onConfirm={confirmDelete}
            onCancel={() => setDeleteId(null)}
            title="Delete Product?"
            message="Are you sure you want to remove this item from your inventory?"
          />
        )}
      </div>
    );
  }
}

function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || data || []);
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all duration-500 text-slate-900 dark:text-white">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <ShoppingBag
              className="text-indigo-600 dark:text-indigo-400"
              size={32}
            />
            Orders Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track fulfillment, payments, and shipping logistics.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

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
                  <tr
                    key={order._id}
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all"
                  >
                    {/* ID */}
                    <td className="py-6 px-6 align-top">
                      <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    {/* CUSTOMER & ADDRESS */}
                    <td className="py-6 px-6 align-top">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {order.user?.name || "Guest User"}
                      </div>
                      <div className="flex items-start gap-1 mt-1 text-slate-500 text-xs italic line-clamp-1">
                        <MapPin size={12} className="mt-0.5 shrink-0" />
                        {order.address}
                      </div>
                    </td>

                    {/* ITEMS */}
                    <td className="py-6 px-6 align-top">
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 group/item"
                          >
                            <Package
                              size={14}
                              className="text-slate-300 dark:text-slate-600"
                            />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 rounded">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* FINANCE (TOTAL & PAYMENT STATUS) */}
                    <td className="py-6 px-6 align-top">
                      <div className="font-black text-slate-900 dark:text-white text-base">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                      <div
                        className={`text-[10px] font-bold uppercase mt-1 inline-flex items-center gap-1 ${
                          order.paymentStatus === "paid"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        <CreditCard size={10} />
                        {order.paymentStatus}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="py-6 px-6 align-top">
                      <StatusPill status={order.status} />
                    </td>

                    {/* DATE */}
                    <td className="py-6 px-6 align-top text-right font-medium text-slate-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
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
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const styles = {
    pending:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    processing:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    completed:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    cancelled:
      "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-transparent ${styles[status]}`}
    >
      {status}
    </span>
  );
}
