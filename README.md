# Rupedia E-Commerce Application

A premium, modern e-commerce web application for Rupedia, specializing in curated home decor, stationery, and lifestyle products. This application captures a high-end aesthetic with a focus on user experience, smooth animations, and clear policy communication.

## 🚀 Features

### Core Functionality
-   **Product Browsing**: Clean, grid-based layout with category filtering and search functionality.
-   **Product Details**: Detailed views with high-quality images, descriptions, and related visual cues.
-   **Shopping Cart**: "Drawer" style slide-out cart for easy access without leaving the page.
-   **Checkout System**:
    -   Address and contact form.
    -   Dynamic delivery fee calculation (Inside Dhaka: 80 BDT, Outside: 130 BDT).
    -   Payment integration (COD, bKash, Nagad).
    -   Location-based logic.

### Specialized Orders
-   **Pre-order System**:
    -   Dedicated section for upcoming items.
    -   Specific "Pre-order" badges and call-to-actions.
    -   Clear delivery timeline warnings (20-30 days).
-   **Custom Order System**:
    -   Dedicated page for personalized items (e.g., Art Canvas, Nameplates).
    -   "Request a Product" feature via email.
    -   Specific cancellation policies (24-hour window) and delivery times (5-7 days).

### UI/UX
-   **Premium Design**:
    -   **Typography**: `Playfair Display` (Serif) for elegance, `Inter` (Sans) for readability.
    -   **Glassmorphism**: Modern frosted glass effects on navigation and overlays.
    -   **Animations**: Smooth fade-ins, hover lifts, and transition effects.
-   **Responsive Layout**: Fully optimized for Mobile, Tablet, and Desktop.
-   **Facebook Chat Plugin**: Fixed customer support chat bubble.

## 🛠 Tech Stack

-   **Frontend Framework**: [React](https://react.dev/) (v19)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```
rupedia/
├── src/
│   ├── components/       # Reusable UI components (Navbar, ProductCard, Footer, etc.)
│   ├── pages/            # Page components (Home, Shop, ProductDetails, Checkout, etc.)
│   ├── types.ts          # TypeScript interfaces (Product, CartItem, etc.)
│   ├── constants.ts      # Mock data and global constants
│   ├── App.tsx           # Main application component & Routing
│   └── main.tsx          # Entry point
├── index.html            # HTML entry point (Fonts & Tailwind config)
├── package.json          # Dependencies and scripts/
└── tsconfig.json         # TypeScript configuration
```

## ⚡ Getting Started

### Prerequisites
-   Node.js (v18 or higher recommended)
-   npm or yarn

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
    The app will be available at `http://localhost:5173` (or the port Vite assigns).

### Building for Production

To create a production-ready build:

```bash
npm run build
```

To preview the build locally:

```bash
npm run preview
```

## 📜 Policies & Contact

-   **Return Policy**: Open Box policy (check upon delivery). No returns for "change of mind" after acceptance.
-   **Cancellation**:
    -   Standard: 48 hours.
    -   Custom Orders: 24 hours.
-   **Contact**:
    -   Phone/WhatsApp: `01308811838`
    -   Email: `rupediaa@gmail.com`
