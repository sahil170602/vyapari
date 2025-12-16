import { useParams, useNavigate } from "react-router-dom";
import GlassPage from "../components/ui/GlassPage";
import GlassCard from "../components/ui/GlassCard";
import GlassButton from "../components/ui/GlassButton";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const allInvoices = JSON.parse(
    localStorage.getItem("all_invoices") || "[]"
  );

  // 🔥 FIXED MATCHING
  const invoice = allInvoices.find(
    (i) => String(i.id) === String(id)
  );

  if (!invoice) {
    return (
      <GlassPage>
        <p className="text-center text-gray-500 mt-20">
          Invoice not found
        </p>
      </GlassPage>
    );
  }

  return (
    <GlassPage>
      <GlassCard>
        <h1 className="text-lg font-bold mb-2">
          Invoice {invoice.invoiceNumber}
        </h1>

        <p className="text-sm text-gray-600 mb-1">
          Party: <b>{invoice.party}</b>
        </p>

        <p className="text-sm text-gray-600 mb-1">
          Amount: ₹ {invoice.amount}
        </p>

        <p className="text-sm text-gray-600 mb-1">
          Status:{" "}
          <span
            className={
              invoice.status === "pending"
                ? "text-red-500"
                : "text-green-600"
            }
          >
            {invoice.status}
          </span>
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Due Date: {invoice.dueDate}
        </p>

        <div className="flex gap-2">
          <GlassButton
            onClick={() =>
              navigate(`/edit-invoice/${invoice.id}`)
            }
          >
            Edit
          </GlassButton>

          <GlassButton
            className="bg-red-600 text-white"
            onClick={() => {
              if (!window.confirm("Delete this invoice?")) return;

              const updated = allInvoices.filter(
                (i) => String(i.id) !== String(id)
              );

              localStorage.setItem(
                "all_invoices",
                JSON.stringify(updated)
              );

              navigate("/dashboard");
            }}
          >
            Delete
          </GlassButton>
        </div>
      </GlassCard>
    </GlassPage>
  );
}
