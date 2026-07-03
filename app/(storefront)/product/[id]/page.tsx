import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '../../../../sanity/lib/client'
import { getProductByIdQuery, getStoreSettingsQuery } from '../../../../sanity/lib/queries'
import { urlForImage } from '../../../../sanity/lib/image'
import AddToCartButton from '../../../../components/AddToCartButton'
import { formatPrice } from '../../../../utils/price'

export const revalidate = 60 // Revalidate periodically

interface Props {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: Props) {
  let product = null, settings = null
  try {
    const results = await Promise.all([
      client.fetch(getProductByIdQuery, { id: params.id }),
      client.fetch(getStoreSettingsQuery),
    ])
    product = results[0]
    settings = results[1]
  } catch (e) {
    console.error('Sanity fetch failed', e)
  }

  if (!product) {
    notFound()
  }

  const currencySymbol = settings?.currencySymbol || '$'
  const pricingFormat = settings?.pricingFormat

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="aspect-h-1 aspect-w-1 w-full mt-6">
              {product.mainImage ? (
                <Image
                  src={urlForImage(product.mainImage)?.url() || '/placeholder.png'}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover object-center sm:rounded-lg"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 sm:rounded-lg">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {formatPrice(product.price, currencySymbol, pricingFormat)}
              </p>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description?.replace(/\n/g, '<br />') || 'No description available.' }}
              />
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
