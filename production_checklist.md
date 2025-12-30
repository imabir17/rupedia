# Production Readiness Checklist

To take **Rupedia** from a prototype to a fully functional business, you need to implement the following systems.

## 1. Backend & Database (The Brains)
Currently, your app uses "Mock Data" (static files). You need a real system to store and manage data.
- [ ] **Database**: Store Products, Users, Orders, and Reviews. (Recommended: **Supabase** or **PostgreSQL**).
- [ ] **Backend API**: A server to handle logic like "Create Order", "Update Stock", and "Verify Payment". (Recommended: **Node.js/Express**).

## 2. Order Management (Admin Dashboard)
You need a way to see and manage incoming orders.
- [ ] **Admin Panel**: A restricted area where you can:
    -   View new orders.
    -   Change order status (e.g., "Pending" -> "Shipped").
    -   Add/Edit/Delete products without touching code.
    -   View sales analytics.

## 3. Account & Security
- [ ] **Authentication**: Allow users to Sign Up / Login to track their order history.
- [ ] **Protected Routes**: Ensure only Admins can access the dashboard.

## 4. Payment Gateway Integration
Currently, you use manual "Send Money".
- [ ] **Automated Payments**: Integrate with a gateway (like **ShurjoPay**, **SSLCommerz**, or **AamarPay**) to automatically verify payments and update order status.
- [ ] **Manual Verification System**: If sticking to manual bKash, build a system in the Admin Panel to match "Transaction IDs" with Orders manually.

## 5. Media Hosting
- [ ] **Image Storage**: Store product images on a cloud service (e.g., **Cloudinary** or **AWS S3**) instead of local folders or temporary URLs.

## 6. Communications
- [ ] **Transactional Emails**: Automatically send emails when:
    -   A user places an order.
    -   An order is shipped.
    -   A password reset is requested.
    -   (Service: **Resend** or **SendGrid**).

## 7. SEO & Analytics
- [ ] **SEO**: Add dynamic `meta` tags (Title, Description, OpenGraph images) for every product page so they look good when shared on Facebook/WhatsApp.
- [ ] **Analytics**: Connect **Google Analytics 4** or **Facebook Pixel** to track visitor behavior and sales.

## 8. Deployment
- [ ] **Domain**: Purchase a custom domain (e.g., `rupedia.com`).
- [ ] **SSL Certificate**: Ensure the site is served over HTTPS (handled by most hosting providers).
