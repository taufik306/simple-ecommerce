'use client'

import React, { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { urlForImage } from '../sanity/lib/image'

interface Banner {
  _id: string
  title: string
  imageUrl: any
}

interface BannerSliderProps {
  banners: Banner[]
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  if (!banners || banners.length === 0) return null

  return (
    <div className="overflow-hidden w-full relative" ref={emblaRef}>
      <div className="flex touch-pan-y">
        {banners.map((banner) => (
          <div className="flex-[0_0_100%] min-w-0 relative h-[400px] md:h-[500px]" key={banner._id}>
            <Image
              src={urlForImage(banner.imageUrl)?.url() || '/placeholder.png'}
              alt={banner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center px-4">
                {banner.title}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
