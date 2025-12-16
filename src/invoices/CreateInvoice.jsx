import { useState } from "react"
import { calculateGST } from "../utils/gstCalc"
import { generateInvoicePDF } from "../utils/pdfGenerator"

export default function CreateInvoice() {
  const [items, setItems] = useState([])

  const gst = calculateGST(items)

  const handleGeneratePDF = () => {
    generateInvoicePDF({
      invoiceNumber: `VP-${Date.now()}`,
      retailer: "Demo Retailer",
      items,
      gst,
    })
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Create Invoice</h2>

      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input className="border p-1 flex-1" value={item.item_name} />
          <input className="border p-1 w-16" value={item.quantity} />
          <input className="border p-1 w-20" value={item.price} />
        </div>
      ))}

      <div className="mt-4 text-sm">
        <p>Subtotal: ₹{gst.subtotal}</p>
        <p>CGST: ₹{gst.cgst}</p>
        <p>SGST: ₹{gst.sgst}</p>
        <p className="font-bold">Total: ₹{gst.total}</p>
      </div>

      <button
        onClick={handleGeneratePDF}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
      >
        Generate Invoice PDF
      </button>
    </div>
  )
}
