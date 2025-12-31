# Rupedia E-Commerce Application

A premium, modern e-commerce web application for Rupedia, specializing in curated home decor, stationery, and lifestyle products. This application captures a high-end aesthetic with a focus on user experience, smooth animations, and robust backend-like management features completely on the frontend.

## 🚀 Key Features

### 🛒 Customer Experience
-   **Dynamic Product Browsing**: Search, filter by category, and view products with dynamic variant selection (Size, Color, Material).
-   **Guest Order System**: 
    -   **Place Orders**: Seamless checkout without account creation.
    -   **Track Order**: Check real-time status using Order ID (`/order-status`).
    -   **Request Cancellation**: Submit cancellation requests for pending orders directly from the tracking page.
-   **Smart Checkout**:
    -   Location-based delivery fee calculation (Inside/Outside Dhaka).
    -   Payment integration (COD, bKash, Nagad) with Transaction ID verification.
-   **Specialized Ordering**:
    -   **Pre-orders**: Dedicated system for upcoming items with delivery timeline warnings.
    -   **Custom Orders**: Request personalized items with specific requirements.

### 🛡️ Admin Dashboard
Access the powerful admin panel at `/admin` to manage the entire business.

-   **Dashboard Analytics**:
    -   Visual charts for Revenue and Order Trends.
    -   Key metrics: Total Sales, Active Orders, Returns, and Cancellations.
    -   Date-range filtering (Last 7 days, 30 days, etc.).
-   **Order Management**:
    -   **List View**: Filter by status (Unfulfilled, Shipped, Delivered), search by Customer/ID.
    -   **Detail View**: Full timeline logs, address details, and financial summary.
    -   **Status Workflow**: Process orders -> Ship -> Deliver -> Close.
-   **Cancellation Hub**:
    -   Review customer cancellation requests.
    -   Approve (auto-restock inventory) or Reject (with reason) requests.
-   **Product Management**:
    -   Advanced editor for products with multiple variants and SEO settings.
    -   Inventory tracking and low-stock alerts.

## 🛠 Tech Stack

-   **Frontend**: [React](https://react.dev/) (v19) with Hooks & Context API
-   **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Design System
-   **State Management**: React Context (`StoreContext` for Global Data)
-   **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)

## 📂 Project Structure

```
rupedia/
├── src/
│   ├── components/       # Reusable UI (Navbar, ProductCard, CartDrawer, etc.)
│   ├── context/          # Global State (StoreContext, ToastContext)
│   ├── layouts/          # Layout wrappers (PublicLayout, AdminLayout)
│   ├── pages/            # Application Pages
│   │   ├── admin/        # Admin Dashboard & Management Pages
│   │   └── ...           # Public Pages (Home, Shop, Checkout, OrderStatus)
│   ├── types.ts          # TypeScript Definitions (Product, Order, CancellationRequest)
│   ├── constants.ts      # Mock Data & Configuration
│   └── App.tsx           # Route Definitions
├── index.html            # Entry Point
├── package.json          # Dependencies & Scripts
└── README.md             # Project Documentation
```

## ⚡ Getting Started

### Prerequisites
-   Node.js (v18 or higher)
-   npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/rupedia.git
    cd rupedia
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:5173`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory, ready for deployment (Vercel, Netlify, etc.).

## 📜 Workflows & Policies

### Order Fulfillment
1.  **New Order**: Appears as "Pending/Unfulfilled".
2.  **Processing**: Admin validates payment and marks as "Processing".
3.  **Shipping**: Admin ships item, status updates to "Shipped".
4.  **Delivery**: Final status "Delivered".

### Cancellation Policy
-   **Customer Request**: Customers can request cancellation for *Pending* orders only.
-   **Admin Review**: Admin sees request in "Cancellations" tab.
-   **Approval**: Order is marked "Cancelled", items returned to stock.
-   **Rejection**: Order continues processing; customer is notified of reason.

### Contact Support
-   **Hotline**: `01308811838`
-   **Email**: `rupediaa@gmail.com`
