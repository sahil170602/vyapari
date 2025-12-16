import jsPDF from "jspdf"
import "jspdf-autotable"

export const generateInvoicePDF = ({
  invoiceNumber,
  retailer,
  items,
  gst,
}) => {
  const doc = new jsPDF()

  doc.setFontSize(16)
  doc.text("VYAPARI INVOICE", 14, 15)

  doc.setFontSize(10)
  doc.text(`Invoice No: ${invoiceNumber}`, 14, 25)
  doc.text(`Retailer: ${retailer}`, 14, 31)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 37)

  const tableData = items.map((item, i) => [
    i + 1,
    item.item_name,
    item.quantity,
    item.price,
    item.quantity * item.price,
  ])

  doc.autoTable({
    startY: 45,
    head: [["#", "Item", "Qty", "Price", "Total"]],
    body: tableData,
  })

  const finalY = doc.lastAutoTable.finalY + 10

  doc.text(`Subtotal: ₹${gst.subtotal}`, 14, finalY)
  doc.text(`CGST: ₹${gst.cgst}`, 14, finalY + 6)
  doc.text(`SGST: ₹${gst.sgst}`, 14, finalY + 12)
  doc.text(`Grand Total: ₹${gst.total}`, 14, finalY + 20)

  doc.save(`Vyapari_Invoice_${invoiceNumber}.pdf`)
}
