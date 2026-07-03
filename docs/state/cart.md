---
title: Global Cart State Management
description: TL;DR - Documents the Zustand store responsible for managing the shopping cart state, including persistence and mutation methods.
---

# Global Cart State Management

## 1. Overview
The shopping cart state is managed client-side using `zustand` and automatically persisted to the browser's `localStorage` via the `persist` middleware.

## 2. State Structure & Interface

```typescript
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
```

## 3. Data Flow Diagram

```mermaid
graph LR
    A[UI Component: AddToCartButton] -->|dispatches| B[addItem(item)]
    C[UI Component: CartSidebar] -->|dispatches| D[removeItem(sku)]
    C -->|dispatches| E[updateQuantity(sku, num)]
    
    B --> F{Zustand Store Context}
    D --> F
    E --> F
    
    F -->|hydrates/persists| G[(Browser localStorage)]
    F -->|reactively updates| H[UI Components Subscribed to State]
```

## 4. Usage in Components

### 🛑 ARCHITECTURAL CONSTRAINTS
> 🛑 ARCHITECTURAL CONSTRAINTS
> Components subscribing to the cart store **must** handle hydration mismatches. Because the initial state on the server is always empty (as it has no access to `localStorage`), while the client might have items, you must ensure the component is mounted before rendering store-dependent UI, otherwise Next.js will throw a hydration error.

Example hydration mitigation used in `CartSidebar.tsx`:
```tsx
const [mounted, setMounted] = useState(false)
const items = useCartStore((state) => state.items)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null // Prevent rendering until client-side hydration is complete
```
