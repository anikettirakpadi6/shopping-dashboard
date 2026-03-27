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
    <div className="flex bg-white min-h-screen">
      <div className="border-r">
        <Sidebar
          role={role}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 bg-gray-100 min-h-screen">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
