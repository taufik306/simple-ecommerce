import Link from 'next/link'
import CartSidebar from './CartSidebar'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Simple Commerce
            </span>
          </Link>
          <div className="flex items-center">
            <CartSidebar />
          </div>
        </div>
      </div>
    </nav>
  )
}
