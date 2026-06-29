"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  role: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const DashboardLayout: React.FC<Props> = ({
  children,
  role,
  activeTab,
  setActiveTab,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      <Sidebar
        role={role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex min-h-screen flex-col lg:ml-64">
       <Header
          activeTab={activeTab}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white transition-colors duration-300 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
