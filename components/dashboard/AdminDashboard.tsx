import React, { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import EditUserModal from "@/components/AddEditUserModal";
import ProductModal from "@/components/ProductModal";
import DeleteConfirm from "@/components/DeleteConfirm"; // adjust path if needed

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

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type AnalyticsData = {
  users: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    revenue: number;
    pending: number;
    completed: number;
  };
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

type Order = {
  _id: string;
  user?: { name: string };
  products: { name: string; quantity: number }[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

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

function StatCard({
  label,
  value,
  isCurrency = false,
}: {
  label: string;
  value: number;
  isCurrency?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-700 p-5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-colors duration-300">
      <p className="text-sm font-medium text-black dark:text-white">{label}</p>
      {/* <p className="text-2xl font-bold mt-2 text-black dark:text-white">
        {value}
      </p> */}
      <p className="text-2xl font-bold mt-2 text-black dark:text-white">
        {isCurrency ? `₹${value.toLocaleString("en-IN")}` : value}
      </p>
    </div>
  );
}

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
    const [stats, setStats] = useState({
      revenue: 0,
      orders: 0,
      users: 0,
      lowStock: 0,
    });

    const [chartData, setChartData] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchOverview();
    }, []);

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

        // ✅ KPI calculations
        const revenue = orders.reduce(
          (sum: number, o: any) => sum + (o.totalAmount || 0),
          0,
        );

        const lowStock = products.filter((p: any) => p.quantity < 5).length;

        setStats({
          revenue,
          orders: orders.length,
          users: users.length,
          lowStock,
        });

        // ✅ Chart (group by date)
        const grouped: Record<string, number> = {};

        orders.forEach((o: any) => {
          const day = new Date(o.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });

          grouped[day] = (grouped[day] || 0) + (o.totalAmount || 0);
        });

        const formatted = Object.entries(grouped)
          .map(([day, sales]) => ({ day, sales }))
          .sort(
            (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime(),
          );

        setChartData(formatted);

        // ✅ Activity (ONLY recent items)
        const recentUsers = users
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        const recentProducts = products
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        const recentOrders = orders
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        const activityData = [
          ...recentUsers.map((u: any) => ({
            text: `New user: ${u.name}`,
            date: u.createdAt,
          })),
          ...recentProducts.map((p: any) => ({
            text: `Product added: ${p.name}`,
            date: p.createdAt,
          })),
          ...recentOrders.map((o: any) => ({
            text: `Order placed: ₹${o.totalAmount}`,
            date: o.createdAt,
          })),
        ];

        activityData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setActivities(activityData.slice(0, 5));
      } catch (err) {
        console.error("Overview fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return <div className="p-6 text-black">Loading overview...</div>;
    }

    return (
      <div className="p-6 space-y-6">
        {/* KPI */}
        <div className="grid grid-cols-4 gap-4">
          <Card title="Total Revenue" value={`₹${stats.revenue}`} />
          <Card title="Orders" value={stats.orders.toString()} />
          <Card title="Users" value={stats.users.toString()} />
          <Card title="Low Stock Items" value={stats.lowStock.toString()} />
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-3 gap-4">
          {/* CHART */}
          <div className="col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-black/10">
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>

            <div className="h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-black/10">
            <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>

            <ul className="space-y-3 text-sm">
              {activities.map((a, i) => (
                <li key={i} className="border-b pb-2 flex justify-between">
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  function UsersSection() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<keyof UserType | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await fetch("/api/users");
          const data = await res.json();
          setUsers(data.users || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, []);

    // SORT HANDLER
    const handleSort = (key: keyof UserType) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortKey(key);
        setSortOrder("asc");
      }
    };

    // FILTER + SORT
    const filteredUsers = useMemo(() => {
      let data = [...users];

      // SEARCH
      if (search) {
        data = data.filter((u) =>
          `${u.name} ${u.email} ${u.role}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        );
      }

      // SORT
      if (sortKey) {
        data.sort((a, b) => {
          const valA = a[sortKey];
          const valB = b[sortKey];

          if (typeof valA === "string") {
            return sortOrder === "asc"
              ? valA.localeCompare(valB as string)
              : (valB as string).localeCompare(valA);
          }

          if (typeof valA === "boolean") {
            return sortOrder === "asc"
              ? Number(valA) - Number(valB)
              : Number(valB) - Number(valA);
          }

          return 0;
        });
      }

      return data;
    }, [users, search, sortKey, sortOrder]);

    // ACTIONS
    const handleEdit = (user: UserType) => {
      setSelectedUser(user);
    };

    const handleDelete = (id: string) => {
      setDeleteId(id);
    };

    const handleSave = async (user: UserType) => {
      try {
        const isNew = !user._id;

        // Avoid overwriting existing password when empty (edit mode)
        const payload: Partial<UserType> = { ...user };
        if (!isNew && !payload.password) {
          delete payload.password;
        }

        const res = await fetch(
          isNew ? "/api/users" : `/api/users/${user._id}`,
          {
            method: isNew ? "POST" : "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        if (!res.ok) throw new Error();

        const data = await res.json();

        if (isNew) {
          // ADD to list
          setUsers((prev) => [data.user, ...prev]);
        } else {
          // UPDATE list
          setUsers((prev) =>
            prev.map((u) => (u._id === user._id ? data.user : u)),
          );
        }

        toast.success(isNew ? "User added" : "User updated");
        setSelectedUser(null);
      } catch {
        toast.error("Operation failed");
      }
    };

    const confirmDelete = async () => {
      if (!deleteId) return;

      try {
        const res = await fetch(`/api/users/${deleteId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error();

        setUsers((prev) => prev.filter((u) => u._id !== deleteId));

        toast.success("User deleted.");
      } catch (err) {
        toast.error("Delete failed!");
      } finally {
        setDeleteId(null);
      }
    };

    return (
      <div className="p-6 space-y-6 bg-white dark:bg-slate-800 text-black dark:text-white transition-colors duration-300">
        <h1 className="text-2xl text-black dark:text-white font-bold">Users</h1>

        {/* Search */}
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search a user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border text-gray-900 dark:text-white bg-white dark:bg-slate-700 rounded-lg px-4 py-2 w-1/3 transition-colors duration-300"
          />

          <button
            onClick={() =>
              setSelectedUser({
                _id: "",
                name: "",
                email: "",
                role: "customer",
                isActive: true,
                password: "",
              })
            }
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800"
          >
            + Add User
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-black/10 overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead className="border-b">
              <tr className="text-center bg-black text-white font-semibold tracking-wide">
                <th
                  onClick={() => handleSort("name")}
                  className="py-2 px-3 border-r border-gray-500 last:border-r-0"
                >
                  Name
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className="py-2 px-3 border-r border-gray-500 last:border-r-0"
                >
                  Email
                </th>
                <th
                  onClick={() => handleSort("role")}
                  className="py-2 px-3 border-r border-gray-500 last:border-r-0"
                >
                  Role
                </th>
                <th
                  onClick={() => handleSort("isActive")}
                  className="py-2 px-3"
                >
                  Status
                </th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>

            <tbody className="font-medium text-center">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-3 text-black">
                    Loading...
                  </td>
                </tr>
              ) : !filteredUsers.length ? (
                <tr>
                  <td colSpan={5} className="py-3 text-black">
                    No data available.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isActive = user.isActive;

                  return (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-2 px-3 text-black border-r border-gray-200">
                        {user.name}
                      </td>

                      <td className="py-2 px-3 text-black border-r border-gray-200">
                        {user.email}
                      </td>

                      <td className="py-2 px-3 text-black capitalize border-r border-gray-200">
                        {user.role}
                      </td>

                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                            isActive ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="py-2 px-3">
                        <div className="flex justify-center gap-3">
                          <Pencil
                            size={16}
                            className="text-blue-600 cursor-pointer"
                            onClick={() => handleEdit(user)}
                          />
                          <Trash2
                            size={16}
                            className="text-red-600 cursor-pointer"
                            onClick={() => handleDelete(user._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* DELETE CONFIRM */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-5 rounded-xl">
              <p className="text-black mb-4">
                Are you sure you want to delete?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="text-black"
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleSave}
          />
        )}
      </div>
    );
  }

  function AnalyticsSection() {
    const [stats, setStats] = useState<AnalyticsData>({
      users: {
        total: 0,
        active: 0,
      },
      products: {
        total: 0,
        lowStock: 0,
        outOfStock: 0,
      },
      orders: {
        total: 0,
        revenue: 0,
        pending: 0,
        completed: 0,
      },
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

    if (loading) {
      return <div className="p-6 text-black">Loading analytics...</div>;
    }

    return (
      <div className="p-6 space-y-6 bg-white dark:bg-slate-800 text-black dark:text-white transition-colors duration-300">
        <h1 className="text-2xl font-bold">Analytics</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Users" value={stats.users.total} />
          <StatCard label="Products" value={stats.products.total} />
          <StatCard label="Orders" value={stats.orders.total} />
          <StatCard
            label="Revenue"
            value={stats.orders.revenue}
            isCurrency={true}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Low Stock" value={stats.products.lowStock} />
          <StatCard label="Out of Stock" value={stats.products.outOfStock} />
          <StatCard label="Pending Orders" value={stats.orders.pending} />
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          {stats.products.outOfStock > 0 && (
            <div className="bg-red-100 text-red-700 p-3 rounded">
              {stats.products.outOfStock} products are out of stock
            </div>
          )}

          {stats.orders.pending > 0 && (
            <div className="bg-yellow-100 text-yellow-700 p-3 rounded">
              {stats.orders.pending} pending orders
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue / Orders Trend</h2>

          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />

                {/* Revenue Line */}
                <Line type="monotone" dataKey="revenue" strokeWidth={2} />

                {/* Orders Line */}
                <Line type="monotone" dataKey="orders" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  function ProductsSection() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = React.useState(false);
    const [imagePreview, setImagePreview] = React.useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [form, setForm] = useState({
      name: "",
      price: "",
      quantity: "",
      image: "",
      description: "",
      categoryId: "",
    });

    const [editingId, setEditingId] = useState<string | null>(null);

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

    // Handle input
    const handleChange = (key: string, value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

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

        if (!res.ok) {
          throw new Error(data.error || "Request failed");
        }

        // normalize response (handles both POST and PUT)
        const product = data.product || data;

        if (!product || !product._id) {
          throw new Error("Invalid product response");
        }

        if (isNew) {
          setProducts((prev) => [product, ...prev]);
        } else {
          setProducts((prev) =>
            prev.map((p) => (p._id === editingId ? product : p)),
          );
        }

        toast.success(isNew ? "Product added" : "Product updated");

        // reset form
        setForm({
          name: "",
          price: "",
          quantity: "",
          image: "",
          description: "",
          categoryId: "",
        });

        setEditingId(null);
      } catch (err: any) {
        toast.error(err.message || "Operation failed");
      }
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

    // Edit
    const handleEdit = (p: Product) => {
      setForm({
        name: p.name || "",
        price: String(p.price) || "",
        quantity: String(p.quantity) || "",
        image: p.image || "",
        description: p.description || "",
        categoryId:
          typeof p.categoryId === "object" && p.categoryId !== null
            ? p.categoryId._id
            : p.categoryId || "",
      });
      setEditingId(p._id);
    };

    return (
      <div className="p-6 space-y-6 bg-white dark:bg-slate-800 text-black dark:text-white transition-colors duration-300">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-black dark:text-white font-bold">
            Product Inventory
          </h2>

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
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
          >
            + Add Product
          </button>
        </div>

        {/* EMPTY STATE */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20 border rounded-xl">
            <p className="text-md text-black dark:text-white font-medium">
              No products available
            </p>
          </div>
        )}

        {/* GRID */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {products.filter(Boolean).map((p: Product) => (
              <div
                key={p._id}
                className="border border-black/10 rounded-xl p-4 bg-white"
              >
                <div className="h-40 w-full flex items-center justify-center bg-gray-100 rounded mb-2 overflow-hidden">
                  <img
                    src={
                      p?.image && !p.image.startsWith("blob:")
                        ? p.image
                        : "https://via.placeholder.com/150"
                    }
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="font-semibold text-black">{p.name}</h3>

                <p className="text-black text-sm">₹{p.price}</p>

                <p
                  className={`text-sm ${
                    p.quantity < 5 ? "text-red-600 font-semibold" : "text-black"
                  }`}
                >
                  Stock: {p.quantity}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      handleEdit(p);
                      setImagePreview(
                        p.image && !p.image.startsWith("blob:") ? p.image : "",
                      );
                      setShowModal(true);
                    }}
                    className="px-3 py-1 border rounded text-black hover:bg-black hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setDeleteId(String(p._id));
                    }}
                    className="px-3 py-1 border rounded text-black hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <ProductModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={async () => {
            await handleSubmit();
            setShowModal(false);
          }}
          form={form}
          setForm={setForm}
          categories={categories}
          editingId={editingId}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        {deleteId && (
          <DeleteConfirm onConfirm={confirmDelete} onCancel={cancelDelete} />
        )}
      </div>
    );
  }
}

function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-black">Loading orders...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-slate-800 text-black dark:text-white transition-colors duration-300">
      <h1 className="text-2xl text-black dark:text-white font-bold">Orders</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="border-b">
            <tr className="text-center bg-black text-white font-semibold tracking-wide">
              <th className="py-2 px-3 border-r border-gray-500 last:border-r-0">
                Order ID
              </th>
              <th className="py-2 px-3 border-r border-gray-500 last:border-r-0">
                Customer
              </th>
              <th className="py-2 px-3 border-r border-gray-500 last:border-r-0">
                Products
              </th>
              <th className="py-2 px-3 border-r border-gray-500 last:border-r-0">
                Total (₹)
              </th>
              <th className="py-2 px-3 border-r border-gray-500 last:border-r-0">
                Status
              </th>
              <th className="py-2 px-3 border-r border-gray-500 last:border-r-0">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-black">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="p-3">{order._id.slice(-6)}</td>

                  <td className="p-3">{order.user?.name || "N/A"}</td>

                  <td className="p-3">
                    {order.products.map((p, i) => (
                      <div key={i}>
                        {p.name} × {p.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="p-3 font-medium">₹{order.totalAmount}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
