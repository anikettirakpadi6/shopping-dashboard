import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  UserPlus,
  Pencil,
  Trash2,
  Plus,
  Edit3,
  ChevronUp,
  ChevronDown,
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  CreditCard,
  MapPin,
  RefreshCw,
  LucideProps,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import EditUserModal from "@/components/AddEditUserModal";
import ProductModal from "@/components/ProductModal";
import DeleteConfirm from "@/components/DeleteConfirm";
import { useOverviewData } from "@/app/hooks/useOverviewData";
import Skeleton from "@/components/dashboard/shared/Skeleton";
import StatsGrid from "./overview/StatsGrid";
import RevenueChart from "@/components/dashboard/overview/RevenueChart";
import ActivityFeed from "@/components/dashboard/overview/ActivityFeed";
import { DashboardHeader } from "./overview/DashboardHeader";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

type Props = {
  activeTab: string;
  isCurrency?: boolean;
  search?: string;
};

type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  password?: string;
};

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

export default function AdminDashboard({ activeTab, search }: Props) {
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
    const { data, loading } = useOverviewData();

    if (loading) return <Skeleton />;

    return (
      <div className="p-8 space-y-8">
        <DashboardHeader />

        <StatsGrid stats={data.stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <RevenueChart chart={data.chart} />
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <ActivityFeed items={data.activity} />
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
          <div className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            {/* ICON WRAPPER */}
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
              <Users size={24} strokeWidth={2} />
            </div>

            {/* TEXT CONTENT */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                User Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Manage team permissions, invite new members, and monitor user
                activity.
              </p>
            </div>
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
            {/* <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <Filter size={18} />
            </button> */}
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
                role: "customer",
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
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            {/* ICON WRAPPER */}
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
              <TrendingUp size={24} strokeWidth={2} />
            </div>

            {/* TEXT CONTENT */}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Analytics
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Monitor real-time performance metrics, audience conversion
                rates, and behavioral data.
              </p>
            </div>
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
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedId = searchParams.get("id");

    const productRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

        setProducts(pData.products || []);
        setCategories(cData.categories || cData || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setLoading(false);
    };

    useEffect(() => {
      fetchData();
    }, []);

    useEffect(() => {
      if (!selectedId) return;

      const el = productRefs.current[selectedId];

      if (!el) return;

      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const timer = setTimeout(() => {
        router.replace(`${pathname}?tab=products`);
      }, 3000);

      return () => clearTimeout(timer);
    }, [selectedId, products]);

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
          <div className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            {/* ICON WRAPPER */}
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
              <Package size={24} strokeWidth={2} />
            </div>

            {/* TEXT CONTENT */}
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
                ref={(el) => {
                  productRefs.current[p._id] = el;
                }}
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
                  selectedId === p._id
                    ? "ring-4 ring-blue-500 bg-blue-50 dark:bg-slate-800 scale-[1.02]"
                    : "border-slate-200 dark:border-slate-800"
                }
              `}
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
        <div className="flex items-start gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          {/* ICON WRAPPER */}
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0 mt-0.5">
            <ShoppingBag size={24} strokeWidth={2} />
          </div>

          {/* TEXT CONTENT */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Orders Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
              Track fulfillment states, clear incoming payments, and orchestrate
              shipping logistics.
            </p>
          </div>
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
                      <div className="flex flex-col gap-3">
                        <StatusPill status={order.status} />

                        <select
                          value={order.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as Order["status"];

                            try {
                              const res = await fetch(
                                `/api/orders/${order._id}`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    status: newStatus,
                                  }),
                                },
                              );

                              const data = await res.json();

                              if (!res.ok) {
                                throw new Error(data.error);
                              }

                              toast.success("Order status updated");

                              setOrders((prev) =>
                                prev.map((o) =>
                                  o._id === order._id
                                    ? { ...o, status: newStatus }
                                    : o,
                                ),
                              );
                            } catch (err: any) {
                              toast.error(err.message);
                            }
                          }}
                          className="text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg px-2 py-1 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
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
      {orders.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm max-w-md mx-auto mt-12">
          <CheckCircle2
            className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
            size={40}
          />
          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
            No orders yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Any purchases you fulfill inside the store tracker will populate
            logs here.
          </p>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const config = {
    pending: {
      className:
        "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      label: "Pending",
    },

    processing: {
      className:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
      label: "Processing",
    },

    completed: {
      className:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      label: "Completed",
    },

    cancelled: {
      className:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
      label: "Cancelled",
    },
  };

  const current = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit ${current.className}`}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      {current.label}
    </span>
  );
}
