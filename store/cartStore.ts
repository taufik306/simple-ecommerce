import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  sku: string
  name: string
  price: number
  quantity: number
  imageUrl: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (sku: string) => void
  updateQuantity: (sku: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.sku === item.sku)
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.sku === item.sku
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (sku) =>
        set((state) => ({
          items: state.items.filter((i) => i.sku !== sku),
        })),
      updateQuantity: (sku, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.sku === sku ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
    }
  )
)
