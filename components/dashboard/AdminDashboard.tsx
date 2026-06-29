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
import { useOrders } from "@/app/hooks/useOrders";
import StatusPill from "../orders/StatusPill";
import OrdersHeader from "../orders/OrdersHeader";
import OrderRow from "@/components/orders/OrderRow";
import OrdersTable from "../orders/OrdersTable";
import EmptyOrders from "../orders/EmptyOrders";
import { useUsers } from "@/app/hooks/useUsers";
import UsersHeader from "./users/UsersHeader";
import UsersToolbar from "./users/UsersToolbar";
import UserRow from "./users/UserRow";
import UsersTable from "./users/UsersTable";

import type {
  DashboardProps,
  MetricProps,
  HealthProps,
} from "app/types/dashboard";

import type { UserType, UserSortKey } from "app/types/user";

import type { Product, Category } from "app/types/product";

import type { Order } from "app/types/order";
import DeleteUserModal from "./users/DeleteUserModal";
import { useProducts } from "@/app/hooks/useProducts";
import ProductHeader from "./products/ProductHeader";
import ProductCard from "./products/ProductCard";
import ProductsGrid from "./products/ProductsGrid";

export default function AdminDashboard({ activeTab, search }: DashboardProps) {
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
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
    const {
      users,
      loading,
      filteredUsers,

      search,
      setSearch,

      sortKey,
      sortOrder,
      handleSort,

      isModalOpen,
      setIsModalOpen,

      selectedUser,
      setSelectedUser,

      deleteId,
      setDeleteId,

      handleSaveUser,
      confirmDelete,
    } = useUsers();

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
        {/* Header Section */}
        <UsersHeader
          onAddUser={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
        />

        {/* Table Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Toolbar */}
          <UsersToolbar search={search} setSearch={setSearch} />

          <UsersTable
            loading={loading}
            users={filteredUsers}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
            onDelete={setDeleteId}
          />
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
        <DeleteUserModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
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
    const {
      loading,

      products,
      categories,

      form,
      setForm,

      showModal,
      setShowModal,

      imagePreview,
      setImagePreview,

      editingId,

      deleteId,
      setDeleteId,

      productRefs,

      fetchProducts,

      openCreateModal,
      openEditModal,

      saveProduct,
      confirmDelete,
    } = useProducts();

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedId = searchParams.get("id");

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

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all duration-500">
        {/* HEADER */}
        <ProductHeader onAdd={openCreateModal} />

        {/* PRODUCT GRID */}
        <ProductsGrid
          loading={loading}
          products={products}
          selectedId={selectedId}
          productRefs={productRefs}
          onEdit={openEditModal}
          onDelete={setDeleteId}
        />

        {/* MODALS */}
        <ProductModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={saveProduct}
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

  function OrdersSection() {
    const { orders, loading, fetchOrders, updateStatus } = useOrders();

    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all duration-500 text-slate-900 dark:text-white">
        {/* HEADER */}
        <OrdersHeader loading={loading} onRefresh={fetchOrders} />

        <OrdersTable
          orders={orders}
          loading={loading}
          onStatusChange={updateStatus}
        />
        {!loading && orders.length === 0 && <EmptyOrders />}
      </div>
    );
  }
}
