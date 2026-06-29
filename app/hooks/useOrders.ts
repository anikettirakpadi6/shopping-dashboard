"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export interface Order {
  _id: string;
  address: string;
  totalAmount: number;
  paymentStatus: "paid" | "pending";
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;

  user?: {
    name: string;
    email: string;
  };

  items: {
    name: string;
    quantity: number;
  }[];
}

export function useOrders() {
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

  const updateStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Order status updated");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status }
            : order
        )
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    updateStatus,
  };
}