'use client'

import { ShoppingCart, X, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCartStore } from '../store/cartStore'
import { generateWhatsAppLink } from '../utils/whatsapp'
import { formatPrice } from '../utils/price'

export default function CartSidebar({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity } = useCartStore()

  // Wait until mounted to prevent hydration errors from localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  const currencySymbol = settings?.currencySymbol || '$'
  const whatsappNumber = settings?.whatsappNumber || '1234567890'
  const pricingFormat = settings?.pricingFormat

  const handleCheckout = () => {
    const link = generateWhatsAppLink(items, whatsappNumber, currencySymbol)
    // Basic event tracking for checkout
    if (typeof window !== 'undefined' && (window as any).va) {
      ;(window as any).va('event', { name: 'checkout_whatsapp_clicked' })
    }
    window.open(link, '_blank')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-700 hover:text-black transition-colors"
        aria-label="Open Cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          <section className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md flex flex-col bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Shopping cart
                  </h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items.length === 0 ? (
                        <p className="py-6 text-gray-500">Your cart is empty.</p>
                      ) : (
                        items.map((item) => (
                          <li key={item.sku} className="flex py-6">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <Image
                                src={item.imageUrl || '/placeholder.png'}
                                alt={item.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <p className="ml-4">
                                    {formatPrice(item.price * item.quantity, currencySymbol, pricingFormat)}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  SKU: {item.sku}
                                </p>
                              </div>
                              <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center border rounded">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.sku,
                                        Math.max(1, item.quantity - 1)
                                      )
                                    }
                                    className="px-3 py-1 hover:bg-gray-100"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 border-x">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.sku, item.quantity + 1)
                                    }
                                    className="px-3 py-1 hover:bg-gray-100"
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex">
                                  <button
                                    type="button"
                                    onClick={() => removeItem(item.sku)}
                                    className="font-medium text-red-600 hover:text-red-500"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>
                    {formatPrice(total, currencySymbol, pricingFormat)}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated via WhatsApp.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    disabled={items.length === 0}
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Checkout via WhatsApp
                  </button>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
