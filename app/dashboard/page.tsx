"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  if (!session) return null;

  const role = session.user.role;

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  }

  let content;

  switch (role) {
    case "admin":
      content = <AdminDashboard activeTab={activeTab} />;
      break;
    case "customer":
      content = <CustomerDashboard activeTab={activeTab} />;
      break;
    case "employee":
      content = <EmployeeDashboard activeTab={activeTab} />;
      break;
    default:
      content = <div>Invalid Role!</div>;
  }

  return (
    <DashboardLayout
      role={role}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {content}
    </DashboardLayout>
  );
}
