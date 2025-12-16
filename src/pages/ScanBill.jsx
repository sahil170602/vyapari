import { useNavigate } from "react-router-dom";
import { X, User, Store } from "lucide-react";

export default function ScanBill() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl w-[90%] max-w-sm p-6 relative animate-scaleIn">

        {/* Close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold text-center mb-6">
          Scan Bill For
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* CUSTOMER */}
          <button
            onClick={() => navigate("/upload/customer")}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border hover:bg-purple-50 active:scale-95 transition"
          >
            <User className="text-purple-600" size={28} />
            <span className="font-medium">Customer</span>
          </button>

          {/* SUPPLIER */}
          <button
            onClick={() => navigate("/upload/supplier")}
            className="flex flex-col items-center gap-3 p-4 rounded-xl border hover:bg-purple-50 active:scale-95 transition"
          >
            <Store className="text-purple-600" size={28} />
            <span className="font-medium">Supplier</span>
          </button>
        </div>
      </div>
    </div>
  );
}
