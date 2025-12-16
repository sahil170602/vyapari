import { supabase } from "./supabase"

export const saveInvoice = async ({
  userId,
  retailerId,
  invoiceNumber,
  gst,
  items,
}) => {
  // 1. Insert invoice
  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      user_id: userId,
      retailer_id: retailerId,
      invoice_number: invoiceNumber,
      subtotal: gst.subtotal,
      cgst: gst.cgst,
      sgst: gst.sgst,
      total_amount: gst.total,
    })
    .select()
    .single()

  if (error) throw error

  // 2. Insert items
  const invoiceItems = items.map(item => ({
    invoice_id: invoice.id,
    item_name: item.item_name,
    quantity: item.quantity,
    price: item.price,
    total: item.quantity * item.price,
  }))

  await supabase.from("invoice_items").insert(invoiceItems)

  // 3. Update retailer outstanding
  await supabase.rpc("increase_outstanding", {
    retailer_id: retailerId,
    amount: gst.total,
  })

  return invoice
}
