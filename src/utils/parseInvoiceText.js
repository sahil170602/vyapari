export const parseInvoiceText = (text) => {
  const lines = text.split("\n").filter(l => l.trim())

  return lines.map(line => {
    const parts = line.split(" ")
    const qty = parseInt(parts.find(p => !isNaN(p))) || 1
    const price = parseInt(parts.reverse().find(p => !isNaN(p))) || 0

    return {
      item_name: line.replace(/[0-9]/g, "").trim(),
      quantity: qty,
      price,
      total: qty * price
    }
  })
}
