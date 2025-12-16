import { useNavigate } from "react-router-dom"

export default function ScanChoiceModal({ onClose }) {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-72 text-center space-y-4">
        
        <h3 className="font-semibold text-lg">Upload Bill</h3>

        <button
          onClick={() => navigate("/upload/customer")}
          className="w-full py-3 rounded-xl bg-purple-600 text-white font-medium"
        >
          Upload Customer Bill
        </button>

        <button
          onClick={() => navigate("/upload/supplier")}
          className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium"
        >
          Upload Supplier Bill
        </button>

        <button onClick={onClose} className="text-gray-500 text-sm">
          Cancel
        </button>
      </div>
    </div>
  )
}
