import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";
import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const role = session.user.role;

  let content;

  switch (role) {
    case "admin":
      content = <AdminDashboard />;
      break;
    case "customer":
      content = <CustomerDashboard />;
      break;
    case "employee":
      content = <EmployeeDashboard />;
      break;
    default:
      content = <div>Invalid Role!</div>;
  }

  return <DashboardLayout role={role}>{content}</DashboardLayout>;
}
