"use client";

import { useSession } from "next-auth/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

export default function DashboardClient() {
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  if (!session) return null;

  const role = session.user.role;

  const defaultTab =
    session?.user.role === "customer" ? "products" : "overview";

  const activeTab = searchParams.get("tab") || defaultTab;

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`);
  };

  let content;

  switch (role) {
    case "admin":
      content = <AdminDashboard activeTab={activeTab} />;
      break;
    case "customer":
      content = <CustomerDashboard activeTab={activeTab} />;
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