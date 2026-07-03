# Simple E-Commerce Web Application

A high-performance, serverless e-commerce platform built with Next.js (App Router), Tailwind CSS, and Sanity CMS.

## Project Overview

This project is designed with a "Zero-Maintenance Operational Mode". It delegates complex backend responsibilities (like user authentication, database management, and payment processing) to external services and focuses entirely on delivering a lightning-fast frontend experience.

- **Content Management:** Fully managed via an embedded Sanity Studio.
- **State Management:** Shopping cart state is handled locally using Zustand and persisted in the browser.
- **Checkout Processing:** Checkout is delegated entirely to WhatsApp via dynamically generated, deterministic `wa.me` links containing order summaries.
- **Performance:** Relies on Static Site Generation (SSG) with On-Demand Revalidation via webhooks.

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Ensure you have a `.env.local` file at the root of the project with your Sanity credentials:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   SANITY_WEBHOOK_SECRET="your_webhook_secret"
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the CMS:**
   Navigate to `http://localhost:3000/studio` to access the embedded Sanity Studio and manage your storefront data.

## Documentation Map

For deep dives into specific parts of the system, refer to the technical documentation:

- [System Architecture & Core Flow](docs/architecture.md) - Details the high-level system design, SSG data fetching strategy, and the WhatsApp checkout engine.
- [Global Cart State Management](docs/state/cart.md) - Explains the Zustand store implementation, data flow, and hydration constraints.
