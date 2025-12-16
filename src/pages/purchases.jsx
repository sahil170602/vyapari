import { useState } from "react";

export default function Purchases() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Purchases
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search supplier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-purple-400 outline-none"
      />

      {/* Empty */}
      <div className="mt-20 text-center text-gray-500">
        No supplier bills yet
      </div>
    </div>
  );
}
