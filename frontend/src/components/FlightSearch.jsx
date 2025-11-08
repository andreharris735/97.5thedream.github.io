import { useState } from "react";

export default function FlightSearch({ onSearch }) {
  const [ident, setIdent] = useState("");

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        className="w-full rounded-lg bg-slate-900 border border-white/10 px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={ident}
        onChange={(e) => setIdent(e.target.value)}
        placeholder="Flight ident (e.g., AA123)"
      />
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
        disabled={!ident.trim()}
        onClick={() => onSearch && ident.trim() && onSearch(ident.trim())}
      >
        Search
      </button>
    </div>
  );
}