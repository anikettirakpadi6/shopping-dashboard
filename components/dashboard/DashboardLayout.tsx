"use client";

import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

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
  return (
    <div className="flex bg-white dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="border-r border-gray-200 dark:border-gray-700">
        <Sidebar
          role={role}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
