import { client } from '../../sanity/lib/client'
import { getActiveBannersQuery, getAllProductsQuery, getStoreSettingsQuery } from '../../sanity/lib/queries'
import BannerSlider from '../../components/BannerSlider'
import ProductCard from '../../components/ProductCard'

export const revalidate = 60 // Revalidate periodically in case webhook fails

export default async function Home() {
  let banners = [], products = [], settings = null
  try {
    const results = await Promise.all([
      client.fetch(getActiveBannersQuery),
      client.fetch(getAllProductsQuery),
      client.fetch(getStoreSettingsQuery),
    ])
    banners = results[0]
    products = results[1]
    settings = results[2]
  } catch (e) {
    console.error('Sanity fetch failed, using fallback data', e)
  }

  const currencySymbol = settings?.currencySymbol || '$'
  const pricingFormat = settings?.pricingFormat

  return (
    <div className="flex flex-col min-h-screen">
      <BannerSlider banners={banners} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Featured Products
        </h2>
        
        {products?.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product: any, index: number) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                currencySymbol={currencySymbol} 
                pricingFormat={pricingFormat}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-12">No products found. Please add some in the CMS.</p>
        )}
      </div>
    </div>
  )
}
