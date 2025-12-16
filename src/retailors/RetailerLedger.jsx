import { useState } from "react"
import { uploadOrderImage } from "../services/uploadService"
import { extractTextFromImage } from "../services/ocrService"
import { parseInvoiceText } from "../utils/parseInvoiceText"
import { calculateGST } from "../utils/gstCalc"
import { generateInvoicePDF } from "../utils/pdfGenerator"
import { saveInvoice } from "../services/invoiceService"

export default function CreateInvoice() {
  // 🔴 TEMP (replace with real auth + selected retailer later)
  const USER_ID = "demo-user-id"
  const RETAILER_ID = "demo-retailer-id"

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const gst = calculateGST(items)

  // 📸 Upload image → OCR → Parse items
  const handleImageUpload = async (e) => {
    try {
      setLoading(true)
      const file = e.target.files[0]
      if (!file) return

      const imageUrl = await uploadOrderImage(file, USER_ID)
      const extractedText = await extractTextFromImage(imageUrl)
      const parsedItems = parseInvoiceText(extractedText)

      setItems(parsedItems)
    } catch (err) {
      alert("Failed to process image")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ✏️ Edit invoice item
  const updateItem = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = field === "item_name" ? value : Number(value)
    setItems(updated)
  }

  // 💾 Save invoice + ledger update
  const handleSaveInvoice = async () => {
    try {
      setSaving(true)

      const invoiceNumber = `VP-${Date.now()}`

      await saveInvoice({
        userId: USER_ID,
        retailerId: RETAILER_ID,
        invoiceNumber,
        gst,
        items,
      })

      alert("Invoice saved & ledger updated")

      // Reset after save
      setItems([])
    } catch (err) {
      alert("Failed to save invoice")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  // 📄 Generate PDF
  const handleGeneratePDF = () => {
    generateInvoicePDF({
      invoiceNumber: `VP-${Date.now()}`,
      retailer: "Retailer Name",
      items,
      gst,
    })
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create Invoice</h2>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {loading && (
        <p className="text-sm text-gray-500">
          Processing order image...
        </p>
      )}

      {/* Editable Items */}
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            className="border p-1 flex-1 rounded"
            value={item.item_name}
            onChange={e =>
              updateItem(index, "item_name", e.target.value)
            }
            placeholder="Item"
          />
          <input
            className="border p-1 w-16 rounded"
            type="number"
            value={item.quantity}
            onChange={e =>
              updateItem(index, "quantity", e.target.value)
            }
          />
          <input
            className="border p-1 w-20 rounded"
            type="number"
            value={item.price}
            onChange={e =>
              updateItem(index, "price", e.target.value)
            }
          />
        </div>
      ))}

      {/* Totals */}
      {items.length > 0 && (
        <div className="mt-4 text-sm border-t pt-2">
          <p>Subtotal: ₹{gst.subtotal}</p>
          <p>CGST: ₹{gst.cgst}</p>
          <p>SGST: ₹{gst.sgst}</p>
          <p className="font-bold text-lg">
            Total: ₹{gst.total}
          </p>
        </div>
      )}

      {/* Actions */}
      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          <button
            onClick={handleGeneratePDF}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Generate Invoice PDF
          </button>

          <button
            onClick={handleSaveInvoice}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Invoice & Update Ledger"}
          </button>
        </div>
      )}
    </div>
  )
}
