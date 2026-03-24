export default function Header() {
  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 border-b border-gray">
      <input
        type="text"
        placeholder="Search"
        className="border border-black text-black rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-gray"
      />

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-black">Welcome back</span>
        <div className="w-9 h-9 bg-black rounded-full" />
      </div>
    </div>
  );
}
