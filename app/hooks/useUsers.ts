"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  isActive: boolean;
}

export interface UserForm extends UserType {
  password?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Search / Sort
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof UserType | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSort = (key: keyof UserType) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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
          .includes(search.toLowerCase())
      );
    }

    if (sortKey) {
      data.sort((a, b) => {
        const valA = a[sortKey] ?? "";
        const valB = b[sortKey] ?? "";

        const result =
          typeof valA === "string"
            ? valA.localeCompare(valB as string)
            : Number(valA) - Number(valB);

        return sortOrder === "asc" ? result : -result;
      });
    }

    return data;
  }, [users, search, sortKey, sortOrder]);

  const handleSaveUser = async (userData: UserType) => {
    try {
      const isNew = !userData._id;

      const url = isNew
        ? "/api/users"
        : `/api/users/${userData._id}`;

      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error();

      const result = await res.json();

      if (isNew) {
        setUsers((prev) => [result.user, ...prev]);
        toast.success("User created successfully");
      } else {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userData._id ? result.user : u
          )
        );

        toast.success("User updated successfully");
      }

      setIsModalOpen(false);
    } catch {
      toast.error("Operation failed. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/users/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setUsers((prev) =>
        prev.filter((u) => u._id !== deleteId)
      );

      toast.success("User deleted successfully");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  return {
    users,
    loading,

    filteredUsers,

    search,
    setSearch,

    sortKey,
    sortOrder,
    handleSort,

    fetchUsers,

    isModalOpen,
    setIsModalOpen,

    selectedUser,
    setSelectedUser,

    deleteId,
    setDeleteId,

    handleSaveUser,
    confirmDelete,
  };
}