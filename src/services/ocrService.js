import axios from "axios"

const OCR_API_KEY = import.meta.env.VITE_OCR_API_KEY

export const extractTextFromImage = async (imageUrl) => {
  const response = await axios.post(
    "https://api.ocr.space/parse/image",
    new URLSearchParams({
      apikey: OCR_API_KEY,
      url: imageUrl,
      language: "eng",
      isOverlayRequired: false,
      OCREngine: 2,
    })
  )

  return response.data.ParsedResults?.[0]?.ParsedText || ""
}
