import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PartyDetails() {
  const { partyName } = useParams();
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(partyName);
  const storageKey = `party_bills_${decodedName}`;

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("date_desc");
  const [bills, setBills] = useState([]);

  /* ---------- LOAD ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setBills(JSON.parse(saved));
    } else {
      const demo = [
        {
          id: 1,
          invoiceNo: "VY-INV-0001",
          date: "2025-01-05",
          amount: 3000,
          status: "pending",
        },
        {
          id: 2,
          invoiceNo: "VY-INV-0002",
          date: "2025-01-10",
          amount: 5200,
          status: "completed",
        },
      ];
      setBills(demo);
      localStorage.setItem(storageKey, JSON.stringify(demo));
    }
  }, [storageKey]);

  const saveBills = (updated) => {
    setBills(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const markAsPaid = (id) => {
    saveBills(
      bills.map((b) =>
        b.id === id ? { ...b, status: "completed" } : b
      )
    );
  };

  const sendReminder = () => {
    const pending = bills.filter((b) => b.status === "pending");
    if (!pending.length) {
      alert("No pending bills 🎉");
      return;
    }
    const total = pending.reduce((s, b) => s + b.amount, 0);
    const msg = `Hello ${decodedName},\n\nYou have ₹${total} pending.\n\n– Vyapari`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  /* ---------- FILTER + SORT ---------- */
  let visible =
    filter === "all"
      ? bills
      : bills.filter((b) => b.status === filter);

  visible = [...visible].sort((a, b) => {
    if (sort === "date_desc") return new Date(b.date) - new Date(a.date);
    if (sort === "date_asc") return new Date(a.date) - new Date(b.date);
    if (sort === "inv_asc") return a.invoiceNo.localeCompare(b.invoiceNo);
    if (sort === "inv_desc") return b.invoiceNo.localeCompare(a.invoiceNo);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4">
      <h1 className="text-xl font-semibold mb-2">{decodedName}</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-white border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="w-full px-4 py-3 mb-4 rounded-xl border bg-white"
      >
        <option value="date_desc">Date: Newest</option>
        <option value="date_asc">Date: Oldest</option>
        <option value="inv_asc">Invoice No ↑</option>
        <option value="inv_desc">Invoice No ↓</option>
      </select>

      {/* Bills */}
      {visible.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No bills found
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((bill) => (
            <div
              key={bill.id}
              onClick={() =>
                navigate(
                  `/parties/${encodeURIComponent(
                    decodedName
                  )}/invoice/${bill.id}`
                )
              }
              className="bg-white p-4 rounded-xl border shadow-sm cursor-pointer"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">₹ {bill.amount}</p>
                  <p className="text-xs text-gray-500">
                    {bill.invoiceNo} • {bill.date}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs ${
                      bill.status === "pending"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {bill.status}
                  </p>
                  {bill.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsPaid(bill.id);
                      }}
                      className="text-xs text-purple-600"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WhatsApp */}
      <button
        onClick={sendReminder}
        className="fixed bottom-20 left-4 right-4 bg-green-600 text-white py-3 rounded-xl shadow-lg"
      >
        Send WhatsApp Reminder
      </button>
    </div>
  );
}
