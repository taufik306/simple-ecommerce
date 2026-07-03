import { CartItem } from '../store/cartStore'
import { formatPrice, PricingFormat } from './price'

export function generateWhatsAppLink(
  items: CartItem[],
  phoneNumber: string,
  currencySymbol: string = '$',
  pricingFormat?: PricingFormat
): string {
  let message = 'Hello, I would like to place an order:\n\n'
  let total = 0

  items.forEach((item) => {
    const lineTotal = item.price * item.quantity
    total += lineTotal
    const formattedPrice = formatPrice(item.price, currencySymbol, pricingFormat)
    const formattedLineTotal = formatPrice(lineTotal, currencySymbol, pricingFormat)
    message += `- ${item.quantity}x [${item.sku}] ${item.name} (${formattedPrice} each) = ${formattedLineTotal}\n`
  })

  const formattedTotal = formatPrice(total, currencySymbol, pricingFormat)
  message += `\n*Total Order Amount: ${formattedTotal}*`

  const cleanNumber = phoneNumber.replace(/\D/g, '')
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
}
