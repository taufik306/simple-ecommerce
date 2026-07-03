'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { urlForImage } from '../sanity/lib/image'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../utils/price'

interface ProductCardProps {
  product: {
    _id: string
    name: string
    sku: string
    price: number
    mainImage: any
  }
  currencySymbol: string
  pricingFormat?: any
  priority?: boolean
}

export default function ProductCard({ product, currencySymbol, pricingFormat, priority = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: urlForImage(product.mainImage)?.url() || '/placeholder.png',
    })
    
    // Basic tracking
    if (typeof window !== 'undefined' && (window as any).va) {
      ;(window as any).va('event', { name: 'add_to_cart', data: { sku: product.sku } })
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
      <Link href={`/product/${product._id}`} className="flex-grow">
        <div className="aspect-[4/5] w-full overflow-hidden bg-gray-100">
          {product.mainImage ? (
            <Image
              src={urlForImage(product.mainImage)?.url() || '/placeholder.png'}
              alt={product.name}
              width={400}
              height={500}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">SKU: {product.sku}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(product.price, currencySymbol, pricingFormat)}
            </p>
          </div>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
