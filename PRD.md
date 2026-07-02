# Product Requirement Document (PRD)

## 1. Document Overview
* **Status:** Ready for Implementation
* **Target Architecture:** Serverless Jamstack (Next.js / Sanity CMS / Vercel)
* **Design Pattern:** Static Site Generation (SSG) with On-Demand Revalidation
* **Handoff Strategy:** Zero-Maintenance Operational Mode (Autonomous Lifecycle)

---

## 2. Executive Summary & Goals
The objective is to deploy a high-performance, responsive e-commerce web application with zero fixed infrastructure overhead and zero ongoing maintenance requirements. The system decouples content management from presentation via a headless CMS, handles all transactional state locally within the user browser, and delegates checkout processing entirely to WhatsApp using deterministic URL parameter building.

---

## 3. System Architecture & Context Diagram

```text
[ Non-Technical User ] ───> [ Sanity Studio Managed Dashboard ]
                                       │ (Content Mutations)
                                       ▼
[ End User Browser ] ──────> [ Vercel Edge CDN (Next.js Static App) ]
                                       │
                                       ▼ (Browser-Side Actions & Analytics)
                             [ Zustand LocalStore Cart ]
                                       │
                                       ▼ (Redirect via Window location)
                             [ WhatsApp Core Link Engine ]

```

---

## 4. Feature Specifications

### 4.1 Content Management System (CMS) Data Models

#### Model: `storeSettings` (New)

* **Purpose:** Global configuration for the storefront.
* **Schema Constraints:**
* `id`: `String` (UUID)
* `currencySymbol`: `String` (Required, e.g., "$", "€", "Rp")
* `whatsappNumber`: `String` (Required, the target phone number for checkout)

#### Model: `banner`

* **Purpose:** Manages the rotating promotional component at the top of the homepage.
* **Schema Constraints:**
* `id`: `String` (UUID, Auto-generated)
* `title`: `String` (Required, Max 100 characters)
* `imageUrl`: `Image Object` (Required, absolute asset reference)
* `isActive`: `Boolean` (Default: `false`, system filters where `isActive == true`)
* `displayOrder`: `Integer` (Optional, used for sequential sorting)



#### Model: `product`

* **Purpose:** Dictates individual flat product listings.
* **Schema Constraints:**
* `id`: `String` (UUID, Auto-generated)
* `sku`: `String` (Required, unique string literal alphanumeric code used for warehouse cross-referencing in messages)
* `name`: `String` (Required, plaintext name)
* `price`: `Decimal` (Required, precision to 2 decimal places, positive non-zero value)
* `mainImage`: `Image Object` (Required)
* `description`: `Text` (Optional, Markdown-supported textarea formatting)
* **Note on Inventory:** Stock availability is not tracked in the CMS. All products are assumed in-stock. Unavailability is handled manually during the WhatsApp conversation.


---

### 4.2 Frontend Presentation & Core Application Pages

* **UI Framework:** Tailwind CSS will be used as the primary styling framework to ensure fast, utility-first development that aligns perfectly with Next.js.
* **SEO:** SEO optimizations (dynamic Open Graph tags, custom meta descriptions) are **out of scope** for this initial iteration.

#### Page: Home (`/`)

* **Dynamic Components:**
* **Top Banner Slider:** Queries `banner` data where `isActive == true` sorted by `displayOrder`. Renders as an automated cycling carousel.
* **Product Catalog Grid:** Queries all `product` items. Items display `mainImage`, `name`, and formatted `price` (using `storeSettings.currencySymbol`). Clicking a product triggers navigation to the absolute dynamic route path `/product/[id]`.


* **State Hooks:** Clicking "Add to Cart" directly from the grid invokes the local client-side cart addition event without directing away from the grid.

#### Page: Product Detail (`/product/[id]`)

* **Dynamic Components:**
* Displays high-resolution `mainImage`, `name`, distinct unique `sku`, formatted currency `price`, and raw HTML/Markdown parsed `description`.
* Context-aware interactive counters specifying item count to append to the cart array.


* **Behavior:** Clicking "Add to Cart" executes state mutation, updating local app context and triggering a floating cart preview UI overlay.

---

### 4.3 Client-Side Shopping Cart & Checkout Gateway

#### Cart Management Lifecycle

* **Storage Provider:** Browser `localStorage` via Zustand middleware hydration.
* **State Structure:**
```ts
interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
}

```

#### Checkout Function & Message Compilation Engine

* **Execution Boundary:** Client-side form submit event.
* **Functional Logic:**
1. Retrieve all items array from state.
2. Fetch global `currencySymbol` and `whatsappNumber` from `storeSettings`.
3. Map items array to string template.
4. Formulate total cost summation loop.
5. Format exact text body using explicit URL encoding rules (100% compliant with `encodeURIComponent`).


* **Target URI Schema Definition:**
`URL = "https://wa.me/" + TargetPhoneNumber + "?text=" + encodeURIComponent(MessageBody)`

#### Analytics & Event Tracking
Basic event tracking (via Vercel Web Analytics or Google Analytics) must be implemented for the following key business events:
* `add_to_cart`: Triggered when an item is added to the cart.
* `checkout_whatsapp_clicked`: Triggered when the user clicks the final checkout button to redirect to WhatsApp.

---

## 5. Non-Functional & Operational Requirements

### 5.1 AI Agent-Friendly Engineering Implementation Code Blocks

To guide code-generation agents directly during implementation, the core logic contracts are defined below.

#### Sanity Schema Blueprint (`schemas/storeSettings.ts`)

```typescript
export default {
  name: 'storeSettings',
  type: 'document',
  title: 'Store Settings',
  fields: [
    { name: 'currencySymbol', type: 'string', title: 'Currency Symbol', initialValue: '$', validation: (Rule: any) => Rule.required() },
    { name: 'whatsappNumber', type: 'string', title: 'WhatsApp Number', description: 'Include country code, no +, no spaces', validation: (Rule: any) => Rule.required() },
  ]
}
```

#### Sanity Schema Blueprint (`schemas/product.ts`)

```typescript
export default {
  name: 'product',
  type: 'document',
  title: 'Product',
  fields: [
    { name: 'sku', type: 'string', title: 'SKU Code', validation: (Rule: any) => Rule.required() },
    { name: 'name', type: 'string', title: 'Product Name', validation: (Rule: any) => Rule.required() },
    { name: 'price', type: 'number', title: 'Price', validation: (Rule: any) => Rule.required().positive() },
    { name: 'mainImage', type: 'image', title: 'Product Image', options: { hotspot: true }, validation: (Rule: any) => Rule.required() },
    { name: 'description', type: 'text', title: 'Product Description' }
  ]
}

```

#### Message Engine Blueprint (`utils/whatsapp.ts`)

```typescript
interface CartItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

export function generateWhatsAppLink(items: CartItem[], phoneNumber: string, currencySymbol: string = '$'): string {
  let message = "Hello, I would like to place an order:\n\n";
  let total = 0;

  items.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    message += `- ${item.quantity}x [${item.sku}] ${item.name} (${currencySymbol}${item.price.toFixed(2)} each) = ${currencySymbol}${lineTotal.toFixed(2)}\n`;
  });

  message += `\n*Total Order Amount: ${currencySymbol}${total.toFixed(2)}*`;
  
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

```

### 5.2 Performance & Hosting Parameters

* **Hosting Model:** Static Site Generation (SSG) hosted on Vercel Edge Infrastructure.
* **On-Demand Revalidation:** Utilize Sanity Webhooks targeted at Vercel API endpoints to invalidate the layout cache and trigger static builds immediately upon CMS data mutation publication events.
* **Operational Maintenance Overhead:** Zero active databases or API runtimes are required. The application relies entirely on client compute and software vendor global CDNs, removing ongoing security patching liabilities.
