import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileScan, FilePlus, X } from "lucide-react";

export default function FabMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ACTION BUBBLES */}
      <div
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40
        flex gap-6 transition-all duration-300
        ${open ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}
        `}
      >
        {/* Scan Bill */}
        <button
          onClick={() => go("/scan-bill")}
          className="w-20 h-20 rounded-full bg-purple-600 text-white
          shadow-xl flex flex-col items-center justify-center gap-1
          active:scale-95 transition"
        >
          <FileScan size={22} />
          <span className="text-[11px] font-medium">Scan Bill</span>
        </button>

        {/* Create Invoice */}
        <button
          onClick={() => go("/create-invoice")}
          className="w-20 h-20 rounded-full bg-indigo-600 text-white
          shadow-xl flex flex-col items-center justify-center gap-1
          active:scale-95 transition"
        >
          <FilePlus size={22} />
          <span className="text-[11px] font-medium">Invoice</span>
        </button>
      </div>

      {/* MAIN FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        w-16 h-16 rounded-full bg-purple-600 text-white
        shadow-2xl flex items-center justify-center
        active:scale-95 transition"
      >
        {open ? <X size={28} /> : <Plus size={28} />}
      </button>
    </>
  );
}
