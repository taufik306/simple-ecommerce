'use client'

import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { urlForImage } from '../sanity/lib/image'

interface AddToCartButtonProps {
  product: {
    sku: string
    name: string
    price: number
    mainImage: any
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity,
      imageUrl: urlForImage(product.mainImage)?.url() || '/placeholder.png',
    })

    if (typeof window !== 'undefined' && (window as any).va) {
      ;(window as any).va('event', { name: 'add_to_cart', data: { sku: product.sku } })
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center border border-gray-300 rounded-md h-12 w-32">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-2 hover:bg-gray-100 text-gray-600 flex-1 h-full flex items-center justify-center"
        >
          -
        </button>
        <span className="px-2 py-2 border-x border-gray-300 flex-1 text-center font-medium">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-2 hover:bg-gray-100 text-gray-600 flex-1 h-full flex items-center justify-center"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-gray-900 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  )
}
