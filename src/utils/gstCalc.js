export const calculateGST = (items, gstRate = 18) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  )

  const gstAmount = (subtotal * gstRate) / 100
  const cgst = gstAmount / 2
  const sgst = gstAmount / 2

  return {
    subtotal,
    cgst,
    sgst,
    total: subtotal + gstAmount,
  }
}
