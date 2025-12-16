export function generateInvoiceNumber(type) {
  // type = "customer" | "supplier"

  const counters =
    JSON.parse(localStorage.getItem("invoice_counters")) || {
      customer: 0,
      supplier: 0,
    };

  if (type === "customer") {
    counters.customer += 1;
    localStorage.setItem(
      "invoice_counters",
      JSON.stringify(counters)
    );
    return `CB_${counters.customer}`;
  }

  if (type === "supplier") {
    counters.supplier += 1;
    localStorage.setItem(
      "invoice_counters",
      JSON.stringify(counters)
    );
    return `SB_${counters.supplier}`;
  }

  throw new Error("Invalid invoice type");
}
