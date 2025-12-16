import { useState, useEffect } from "react";
import GlassPage from "../components/ui/GlassPage";
import GlassCard from "../components/ui/GlassCard";
import GlassButton from "../components/ui/GlassButton";
import InvoicePreview from "../components/ScanPreview";
import { Plus, Trash, Save, Eye, Calendar } from "lucide-react";


/* ---------- INVOICE NUMBER GENERATORS ---------- */
const generateCustomerInvoiceNumber = () => {
  const key = "invoice_counters";
  const counters = JSON.parse(localStorage.getItem(key)) || {
    customer: 0,
    supplier: 0,
  };
  counters.customer += 1;
  localStorage.setItem(key, JSON.stringify(counters));
  return `CB_${counters.customer}`;
};

const generateSupplierInvoiceNumber = () => {
  const key = "invoice_counters";
  const counters = JSON.parse(localStorage.getItem(key)) || {
    customer: 0,
    supplier: 0,
  };
  counters.supplier += 1;
  localStorage.setItem(key, JSON.stringify(counters));
  return `SB_${counters.supplier}`;
};

export default function CreateInvoice() {
  const [invoiceType, setInvoiceType] = useState("customer");

  const [invoiceNumber, setInvoiceNumber] = useState(
    generateCustomerInvoiceNumber()
  );

  const [party, setParty] = useState("");
  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("pending");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

    /* ---------- LOCAL LISTS ---------- */
  const parties = JSON.parse(
    localStorage.getItem("vyapari_parties") || "[]"
  );

  const suppliers = JSON.parse(
    localStorage.getItem("vyapari_suppliers") || "[]"
  );
     /* ===============================
     AUTO-FILL FROM SCANNED IMAGE
     =============================== */
  useEffect(() => {
    const scanned = localStorage.getItem("scanned_invoice_draft");
    if (!scanned) return;

    try {
      const data = JSON.parse(scanned);

      // auto switch type
      if (data.type && data.type !== invoiceType) {
        setInvoiceType(data.type);
      }

      // auto generate correct bill number
      if (data.type === "supplier") {
        setInvoiceNumber(generateSupplierInvoiceNumber());
      } else {
        setInvoiceNumber(generateCustomerInvoiceNumber());
      }

      // auto-fill fields ONLY if present
      if (data.party) setParty(data.party);
      if (data.billDate) setBillDate(data.billDate);
      if (data.dueDate) setDueDate(data.dueDate);
      if (Array.isArray(data.items) && data.items.length > 0) {
        setItems(data.items);
      }
      if (data.notes) setNotes(data.notes);

      // cleanup so manual flow is not affected next time
      localStorage.removeItem("scanned_invoice_draft");
    } catch (e) {
      console.error("Invalid scanned invoice draft");
    }
  }, []);
      /* ===============================
   AUTO-SWITCH TYPE FROM SCAN
   =============================== */
useEffect(() => {
  const scanned = localStorage.getItem("scanned_invoice_draft");
  if (!scanned) return;

  try {
    const data = JSON.parse(scanned);

    if (data.type === "supplier") {
      setInvoiceType("supplier");
      setInvoiceNumber(generateSupplierInvoiceNumber());
    } else {
      setInvoiceType("customer");
      setInvoiceNumber(generateCustomerInvoiceNumber());
    }

  } catch (e) {
    console.error("Invalid scanned invoice data");
  }
}, []);


  /* ---------- SWITCH NUMBER ON TYPE CHANGE ---------- */
  useEffect(() => {
  if (!localStorage.getItem("scanned_invoice_draft")) {
    if (invoiceType === "customer") {
      setInvoiceNumber(generateCustomerInvoiceNumber());
    } else {
      setInvoiceNumber(generateSupplierInvoiceNumber());
    }
  }
}, [invoiceType]);

  /* ---------- HELPERS ---------- */
  const addItem = () =>
    setItems([...items, { name: "", qty: 1, price: 0 }]);

  const removeItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + Number(i.qty) * Number(i.price),
    0
  );

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const e = {};
    if (!party.trim())
      e.party =
        invoiceType === "customer"
          ? "Party name is required"
          : "Supplier name is required";

    if (!billDate) e.billDate = "Date is required";
    if (invoiceType === "customer" && !dueDate)
      e.dueDate = "Due date required";

    items.forEach((item, i) => {
      if (!item.name.trim())
        e[`item-${i}`] = "Item name required";
      else if (item.qty <= 0 || item.price <= 0)
        e[`item-${i}`] = "Qty & price must be > 0";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------- SAVE ---------- */
  const saveInvoice = () => {
    if (!validate()) return;

    setSaving(true);

    setTimeout(() => {
      const record = {
        invoiceNumber,
        name: party,
        items,
        totalAmount,
        status,
        billDate,
        dueDate: invoiceType === "customer" ? dueDate : null,
        notes,
        type: invoiceType,
        createdAt: new Date(),
      };

      console.log("Saved:", record);

      setSaving(false);
      alert(
        invoiceType === "customer"
          ? "Invoice saved successfully"
          : "Supplier bill saved successfully"
      );
    }, 1000);
  };

  const previewData = {
    invoiceNumber,
    party,
    items,
    totalAmount,
    status,
    billDate,
    dueDate,
    notes,
    type: invoiceType,
  };

  return (
    <GlassPage>
      {/* HEADER + TOGGLE */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">
          {invoiceType === "customer"
            ? "Create Invoice"
            : "Add Supplier Bill"}
        </h1>

        <div className="flex bg-gray-200 rounded-full p-1">
          {["customer", "supplier"].map((type) => (
            <button
              key={type}
              onClick={() => setInvoiceType(type)}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                invoiceType === type
                  ? "bg-purple-600 text-white"
                  : "text-gray-700"
              }`}
            >
              {type === "customer" ? "Customer" : "Supplier"}
            </button>
          ))}
        </div>
      </div>

      {/* NUMBER */}
      <div className="mb-4 bg-gray-100 rounded-xl px-4 py-2 text-sm flex justify-between">
        <span className="text-gray-600">
          {invoiceType === "customer" ? "Invoice No" : "Bill No"}
        </span>
        <span className="font-semibold">{invoiceNumber}</span>
      </div>

      <GlassCard className="space-y-6">
        {/* PARTY / SUPPLIER */}
        <div>
          <label className="text-sm text-gray-600">
            {invoiceType === "customer"
              ? "Party Name"
              : "Supplier Name"}
          </label>

          <input
            list={invoiceType === "customer" ? "party-list" : "supplier-list"}
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="glass-input"
            placeholder={
              invoiceType === "customer"
                ? "Enter party name"
                : "Enter supplier name"
            }
          />

          {errors.party && (
            <p className="text-xs text-red-500 mt-1">{errors.party}</p>
          )}

          <datalist id="party-list">
            {parties.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>

          <datalist id="supplier-list">
            {suppliers.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {/* DATE */}
        <div>
          <label className="text-sm text-gray-600 flex items-center gap-1">
            <Calendar size={14} />
            {invoiceType === "customer" ? "Invoice Date" : "Bill Date"}
          </label>
          <input
            type="date"
            value={billDate}
            onChange={(e) => setBillDate(e.target.value)}
            className="glass-input"
          />
          {errors.billDate && (
            <p className="text-xs text-red-500">{errors.billDate}</p>
          )}
        </div>

        {/* DUE DATE (CUSTOMER ONLY) */}
        {invoiceType === "customer" && (
          <div>
            <label className="text-sm text-gray-600">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="glass-input"
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500">{errors.dueDate}</p>
            )}
          </div>
        )}

        {/* ITEMS */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">
            {invoiceType === "customer" ? "Items" : "Bill Items"}
          </h3>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2">
              <input
                className="glass-input col-span-5"
                placeholder="Item"
                value={item.name}
                onChange={(e) =>
                  updateItem(index, "name", e.target.value)
                }
              />
              <input
                type="number"
                className="glass-input col-span-2"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) =>
                  updateItem(index, "qty", Number(e.target.value))
                }
              />
              <input
                type="number"
                className="glass-input col-span-3"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  updateItem(index, "price", Number(e.target.value))
                }
              />
              <button
                onClick={() => removeItem(index)}
                className="col-span-2 text-red-500 flex justify-center"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}

          <button
            onClick={addItem}
            className="flex items-center gap-2 text-purple-600 text-sm"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between bg-purple-50 p-3 rounded-xl">
          <span>Total</span>
          <span className="font-bold">₹ {totalAmount}</span>
        </div>

        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="glass-input"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        {/* NOTES */}
        <textarea
          rows="3"
          className="glass-input"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* BUTTONS */}
        <div className="flex gap-3">
          <GlassButton
            variant="secondary"
            icon={<Eye size={18} />}
            onClick={() => validate() && setPreviewOpen(true)}
          >
            Preview
          </GlassButton>

          <GlassButton
            loading={saving}
            icon={<Save size={18} />}
            size="lg"
            onClick={saveInvoice}
          >
            {invoiceType === "customer"
              ? "Save Invoice"
              : "Save Bill"}
          </GlassButton>
        </div>
      </GlassCard>

      {previewOpen && (
        <InvoicePreview
          invoice={previewData}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </GlassPage>
  );
}
