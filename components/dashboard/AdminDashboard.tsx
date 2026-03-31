import { useEffect, useState } from "react";
import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import EditUserModal from "@/components/EditUserModal";

type Props = {
  activeTab: string;
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
  totalUsers: number;
  activeUsers: number;
  admins: number;
  customers: number;
};

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-700 p-5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-colors duration-300">
      <h2 className="text-sm font-medium text-black dark:text-white">{title}</h2>
      <p className="text-2xl font-bold mt-2 text-black dark:text-white">{value}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-700 p-5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-colors duration-300">
      <p className="text-sm font-medium text-black dark:text-white">{label}</p>
      <p className="text-2xl font-bold mt-2 text-black dark:text-white">{value}</p>
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

  return <OverviewSection />;

  // Overview Section
  function OverviewSection() {
    const salesData = [
      { day: "Mon", sales: 400 },
      { day: "Tue", sales: 700 },
      { day: "Wed", sales: 500 },
      { day: "Thu", sales: 900 },
      { day: "Fri", sales: 1200 },
      { day: "Sat", sales: 800 },
      { day: "Sun", sales: 600 },
    ];

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

            <div className="h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
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
          <div className="bg-white dark:bg-slate-900 dark:border-slate-700 p-5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm hover:shadow-md transition-colors duration-300">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Recent Activity
            </h2>

            <ul className="space-y-3 text-sm text-black dark:text-white">
              <li className="border-b pb-2">New user registered</li>
              <li className="border-b pb-2">Order #1234 placed</li>
              <li>Payment received</li>
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
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
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
    const [stats, setStats] = useState({
      total: 0,
      active: 0,
      admins: 0,
      customers: 0,
      employees: 0,
    });

    const [loading, setLoading] = useState(true);

    const chartData = [
      { day: "Mon", users: 12 },
      { day: "Tue", users: 18 },
      { day: "Wed", users: 10 },
      { day: "Thu", users: 22 },
      { day: "Fri", users: 28 },
      { day: "Sat", users: 20 },
      { day: "Sun", users: 16 },
    ];

    useEffect(() => {
      fetchStats();
    }, []);

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        const users = data.users || [];

        setStats({
          total: users.length,
          active: users.filter((u: any) => u.isActive).length,
          admins: users.filter((u: any) => u.role === "admin").length,
          customers: users.filter((u: any) => u.role === "customer").length,
          employees: users.filter((u: any) => u.role === "employee").length,
        });
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
      <div className="p-6 text-black space-y-6">
        <h1 className="text-2xl text-black dark:text-white font-bold">Analytics</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={stats.total} />
          <StatCard label="Active Users" value={stats.active} />
          <StatCard label="Admins" value={stats.admins} />
          <StatCard label="Customers" value={stats.customers} />
          <StatCard label="Employees" value={stats.employees} />
        </div>

        {/* Chart */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>

          <div className="h-[260px] w-full min-w-0">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}
