export function generateTallyCSV() {
  const parties =
    JSON.parse(localStorage.getItem("parties_data")) || [];

  const suppliers =
    JSON.parse(localStorage.getItem("supplier_bills")) || [];

  let csv =
    "TYPE,NAME,REFERENCE NO,DATE,AMOUNT,STATUS\n";

  // Customers
  parties.forEach((p) => {
    (p.invoices || []).forEach((inv) => {
      csv += `CUSTOMER,${p.name},${inv.invoiceNumber},${inv.date},${inv.amount},${inv.status}\n`;
    });
  });

  // Suppliers
  suppliers.forEach((s) => {
    csv += `SUPPLIER,${s.supplierName},${s.billNumber},${s.date},${s.amount},\n`;
  });

  return csv;
}
