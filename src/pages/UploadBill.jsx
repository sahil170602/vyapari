import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Loader2, Image as ImageIcon } from "lucide-react";

export default function UploadBill() {
  const { billType } = useParams(); // customer | supplier
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [image, setImage] = useState(null); // base64
  const [analyzing, setAnalyzing] = useState(false);

  /* ---------- IMAGE PICK ---------- */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = ""; // allow reselect same image

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ---------- REAL AI SCAN ---------- */
  const startScan = async () => {
    if (!image) {
      alert("Please upload bill image first");
      return;
    }

    try {
      setAnalyzing(true);

      const res = await fetch("/functions/v1/scan-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: image.split(",")[1], // 🔥 IMPORTANT
          billType, // customer | supplier
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Scan failed");
        return;
      }

      /* ---------- SAVE DRAFT ---------- */
      localStorage.setItem(
        "scanned_invoice_draft",
        JSON.stringify(data)
      );

      navigate("/create-invoice");
    } catch (err) {
      console.error(err);
      alert("Network / Server error");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="w-[90%] max-w-sm bg-[#0b1324] rounded-2xl p-6 text-center">

        {/* IMAGE PICKER */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border border-white/20 rounded-xl p-6 cursor-pointer"
        >
          {image ? (
            <img
              src={image}
              alt="Bill preview"
              className="rounded-lg max-h-48 mx-auto object-contain"
            />
          ) : (
            <>
              <Camera size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-300 text-sm">
                Tap to upload bill image
              </p>
            </>
          )}
        </div>

        {/* AI SCAN BUTTON */}
        <button
          onClick={startScan}
          disabled={analyzing}
          className="w-full mt-4 py-3 rounded-xl
          bg-purple-600 text-white font-semibold
          flex items-center justify-center gap-2
          disabled:opacity-60"
        >
          {analyzing ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Analyzing...
            </>
          ) : (
            <>
              <ImageIcon size={18} />
              AI Magic Scan
            </>
          )}
        </button>

        {/* CANCEL */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 mt-4"
        >
          Cancel
        </button>

        {/* FILE INPUT */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
