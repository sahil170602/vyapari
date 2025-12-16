import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Parties() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [parties, setParties] = useState([]);

  /* ---------------- LOAD PARTIES FROM GLOBAL INVOICES ---------------- */
  useEffect(() => {
    const allInvoices = JSON.parse(
      localStorage.getItem("all_invoices") || "[]"
    );

    const partyMap = {};

    allInvoices.forEach((inv) => {
      if (!inv.party) return;

      if (!partyMap[inv.party]) {
        partyMap[inv.party] = {
          name: inv.party,
          totalBills: 0,
          pendingAmount: 0,
        };
      }

      partyMap[inv.party].totalBills += 1;

      if (inv.status === "pending") {
        partyMap[inv.party].pendingAmount += Number(inv.amount || 0);
      }
    });

    setParties(Object.values(partyMap));
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredParties = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4">
      {/* Header */}
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Parties
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search party name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 mb-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      {/* Party List */}
      {filteredParties.length === 0 ? (
        <div className="mt-20 text-center text-gray-500">
          No parties found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredParties.map((party) => (
            <div
              key={party.name}
              onClick={() =>
                navigate(
                  `/parties/${encodeURIComponent(party.name)}`
                )
              }
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer active:scale-[0.98] transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    {party.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {party.totalBills} bills
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      party.pendingAmount > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    ₹ {party.pendingAmount}
                  </p>
                  <p className="text-xs text-gray-400">
                    Pending
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
