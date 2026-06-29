import { LucideProps } from "lucide-react";
import React from "react";

export interface MetricProps {
  label: string;
  value: number;
  icon: React.ReactElement<LucideProps>;
  isCurrency?: boolean;
  color: "emerald" | "blue" | "purple" | "orange";
}

export interface HealthProps {
  label: string;
  value: number;
  color: "red" | "orange" | "blue";
}

export interface DashboardProps {
  activeTab: string;
  isCurrency?: boolean;
  search?: string;
}