export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white shadow-lg p-6 border-r border-gray-200">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Dashboard</h1>

      <ul className="space-y-2">
      <li className="p-3 hover:bg-gray-100 rounded cursor-pointer text-gray-700 font-medium transition">
        Home
      </li>
      <li className="p-3 hover:bg-gray-100 rounded cursor-pointer text-gray-700 font-medium transition">
        Orders
      </li>
      <li className="p-3 hover:bg-gray-100 rounded cursor-pointer text-gray-700 font-medium transition">
        Settings
      </li>
      </ul>
    </div>
  );
}