import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 p-6 text-gray-100 overflow-auto">
        {children}
      </main>
      </div>
    </div>
  );
}
