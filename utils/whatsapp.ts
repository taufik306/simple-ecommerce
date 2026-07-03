import { CartItem } from '../store/cartStore'

export function generateWhatsAppLink(
  items: CartItem[],
  phoneNumber: string,
  currencySymbol: string = '$'
): string {
  let message = 'Hello, I would like to place an order:\n\n'
  let total = 0

  items.forEach((item) => {
    const lineTotal = item.price * item.quantity
    total += lineTotal
    message += `- ${item.quantity}x [${item.sku}] ${item.name} (${currencySymbol}${item.price.toFixed(2)} each) = ${currencySymbol}${lineTotal.toFixed(2)}\n`
  })

  message += `\n*Total Order Amount: ${currencySymbol}${total.toFixed(2)}*`

  const cleanNumber = phoneNumber.replace(/\D/g, '')
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}
