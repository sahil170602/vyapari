import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassPage from "../components/ui/GlassPage";
import GlassCard from "../components/ui/GlassCard";
import EmptyState from "../components/ui/EmptyState";
import { FileText, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  /* ---------------- INVOICES (TEMP → REAL USE) ---------------- */
  const [invoices, setInvoices] = useState([
    {
      id: "1",
      invoiceNumber: "VY-INV-0001",
      party: "Sharma Hardware",
      amount: 18500,
      status: "pending",
      dueDate: "2025-01-10",
    },
    {
      id: "2",
      invoiceNumber: "VY-INV-0002",
      party: "Gupta Stores",
      amount: 9200,
      status: "completed",
      dueDate: "2025-01-05",
    },
  ]);

  /* ---------------- SYNC TO GLOBAL STORE ---------------- */
  useEffect(() => {
  const existing = JSON.parse(
    localStorage.getItem("all_invoices") || "[]"
  );

  const map = new Map(existing.map(i => [String(i.id), i]));

  invoices.forEach(inv => {
    map.set(String(inv.id), {
      id: String(inv.id),
      invoiceNumber: inv.invoiceNumber,
      party: inv.party,
      amount: inv.amount,
      dueDate: inv.dueDate,
      status: inv.status,
    });
  });

  localStorage.setItem(
    "all_invoices",
    JSON.stringify([...map.values()])
  );
}, [invoices]);


  /* ---------------- HELPERS ---------------- */

  const today = new Date();

  const markAsPaid = (id) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: "completed" } : inv
      )
    );
  };

  const sendPaymentReminder = (invoice) => {
    const msg = `Payment reminder for ₹${invoice.amount}\nInvoice: ${invoice.invoiceNumber}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  /* ---------------- FILTERING ---------------- */

  const enrichedInvoices = invoices.map((inv) => ({
    ...inv,
    overdue:
      inv.status === "pending" &&
      new Date(inv.dueDate) < today,
  }));

  const filteredInvoices =
    filter === "all"
      ? enrichedInvoices
      : filter === "overdue"
      ? enrichedInvoices.filter((i) => i.overdue)
      : enrichedInvoices.filter((i) => i.status === filter);

  const totalPending = enrichedInvoices
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + i.amount, 0);

  const totalCompleted = enrichedInvoices
    .filter((i) => i.status === "completed")
    .reduce((s, i) => s + i.amount, 0);

  /* ---------------- UI ---------------- */

  return (
    <GlassPage>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <GlassCard className="bg-blue-500/20">
          <p className="text-sm text-blue-900">Total Pending</p>
          <p className="text-2xl font-bold text-blue-900">
            ₹ {totalPending}
          </p>
        </GlassCard>

        <GlassCard className="bg-green-500/20">
          <p className="text-sm text-green-900">Completed</p>
          <p className="text-2xl font-bold text-green-900">
            ₹ {totalCompleted}
          </p>
        </GlassCard>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 mb-4">
        {["all", "pending", "completed", "overdue"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium
              ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-white/70 text-gray-700"
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* INVOICE LIST */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Create your first invoice to start tracking collections."
          actionLabel="Create Invoice"
          onAction={() => navigate("/create-invoice")}
        />
      ) : (
        <div className="space-y-3">
          {filteredInvoices.map((inv) => (
            <GlassCard
              key={inv.id}
              className="cursor-pointer"
              onClick={() => navigate(`/invoice/${inv.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{inv.party}</p>
                  <p className="text-xs text-gray-500">
                    {inv.invoiceNumber} • Due {inv.dueDate}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">₹ {inv.amount}</p>

                  {inv.status === "pending" ? (
                    <div className="flex flex-col items-end gap-1 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsPaid(inv.id);
                        }}
                        className="flex items-center gap-1 text-green-600 text-xs"
                      >
                        <CheckCircle size={14} />
                        Mark as Paid
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendPaymentReminder(inv);
                        }}
                        className="text-xs text-blue-600"
                      >
                        Send Reminder
                      </button>

                      {inv.overdue && (
                        <span className="text-xs text-red-600">
                          Overdue
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-green-600">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </GlassPage>
  );
}
