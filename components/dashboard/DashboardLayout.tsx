import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
  role: string;
};

export default function DashboardLayout({ children, role }: Props) {
  return (
    <div className="flex bg-white min-h-screen">
      <div className="border-r border-gray">
        <Sidebar role={role} />
      </div>

      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-6 bg-gray-100 min-h-screen">{children}</div>
      </div>
    </div>
  );
}
