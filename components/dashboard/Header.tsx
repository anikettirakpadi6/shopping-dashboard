export default function Header() {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-md border-b border-gray-200">
      <input
      type="text"
      placeholder="Search products..."
      className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-800">Hello</span>
      <div className="w-8 h-8 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors cursor-pointer"></div>
      </div>
    </div>
  );
}
