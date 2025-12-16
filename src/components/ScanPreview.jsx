import { useState } from "react"
import GlassCard from "./ui/GlassCard"
import GlassButton from "./ui/GlassButton"

export default function ScanPreview({ image, type, onClose, onSave }) {
  // mocked OCR data
  const [party, setParty] = useState("")
  const [items, setItems] = useState([
    { name: "Item 1", qty: 1, price: 100 }
  ])
  const [status, setStatus] = useState("pending")

  const total = items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center">
      <GlassCard className="w-[95%] max-w-md max-h-[90vh] overflow-y-auto">

        <h2 className="font-semibold mb-3">
          Review & Edit Bill
        </h2>

        <img
          src={image}
          alt="Bill"
          className="w-full rounded-lg mb-4"
        />

        <label className="text-sm">Party Name</label>
        <input
          className="glass-input mb-3"
          value={party}
          onChange={(e) => setParty(e.target.value)}
        />

        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2">
            <input
              className="glass-input"
              value={item.name}
              onChange={(e) => {
                const updated = [...items]
                updated[i].name = e.target.value
                setItems(updated)
              }}
            />
            <input
              type="number"
              className="glass-input"
              value={item.qty}
              onChange={(e) => {
                const updated = [...items]
                updated[i].qty = Number(e.target.value)
                setItems(updated)
              }}
            />
            <input
              type="number"
              className="glass-input"
              value={item.price}
              onChange={(e) => {
                const updated = [...items]
                updated[i].price = Number(e.target.value)
                setItems(updated)
              }}
            />
          </div>
        ))}

        <p className="font-semibold mt-3">
          Total: ₹ {total}
        </p>

        <div className="flex gap-3 mt-4">
          <GlassButton onClick={onSave}>Save</GlassButton>
          <GlassButton variant="secondary" onClick={onClose}>
            Cancel
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  )
}
