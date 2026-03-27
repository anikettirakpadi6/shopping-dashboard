type Props = {
  activeTab: string;
};

export default function EmployeeDashboard({ activeTab }: Props) {
  return <div className="p-6">Employee: {activeTab}</div>;
}
