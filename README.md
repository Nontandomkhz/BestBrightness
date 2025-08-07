# 🌟 Best Brightness
### *Illuminating Your E-commerce Experience*

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview

**Best Brightness** is a cutting-edge, full-stack e-commerce management system designed to streamline business operations across multiple user roles. Built with modern web technologies, it offers a seamless experience for customers, cashiers, and administrators.

### ✨ Key Highlights

- 🛒 **Multi-Role Architecture**: Customer, Cashier & Admin interfaces
- 🔐 **Advanced Security**: Role-based access control with 2FA
- 📱 **Responsive Design**: Optimized for all devices
- ⚡ **Real-time Operations**: Live inventory updates across all interfaces
- 📊 **Comprehensive Analytics**: Detailed sales and inventory reporting
- 💳 **Multiple Payment Gateways**: Integrated with Yoco and Paystack
- 🎯 **Point-of-Sale System**: Complete POS functionality for physical stores

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CUSTOMER      │    │     CASHIER     │    │     ADMIN       │
│   Interface     │    │   Interface     │    │   Interface     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Product Browse│    │ • POS System    │    │ • Inventory Mgmt│
│ • Shopping Cart │    │ • Sales Reports │    │ • User Mgmt     │
│ • Checkout      │    │ • Payment Proc. │    │ • Analytics     │
│ • Order History │    │ • Receipt Print │    │ • Order Mgmt    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   SUPABASE      │
                    │   Backend       │
                    │ • Database      │
                    │ • Auth          │
                    │ • Real-time     │
                    │ • Storage       │
                    └─────────────────┘
```

---

## 🎯 Features by Role

<details>
<summary><strong>👥 Customer Features</strong></summary>

- **🏠 Homepage & Navigation**
  - Responsive design across all devices
  - Featured products and promotions
  - Global search functionality

- **👤 Account Management**
  - User registration with email verification
  - Secure login and password reset
  - Profile management

- **🛍️ Shopping Experience**
  - Product browsing (grid/list views)
  - Detailed product pages
  - Advanced search and filtering

- **🛒 Cart & Checkout**
  - Dynamic shopping cart
  - Multi-step checkout process
  - Secure payment processing
  - Order confirmation and tracking

</details>

<details>
<summary><strong>💰 Cashier Features</strong></summary>

- **🖥️ Point-of-Sale System**
  - Dedicated POS interface
  - Barcode scanning support
  - Manual product search
  - Discount application

- **💳 Payment Processing**
  - Multiple payment methods (cash/card)
  - Automatic change calculation
  - Receipt and invoice generation

- **📈 Sales Reporting**
  - Daily, weekly, monthly reports
  - Transaction summaries
  - Performance metrics

</details>

<details>
<summary><strong>⚙️ Admin Features</strong></summary>

- **📊 Dashboard & Analytics**
  - Key business metrics overview
  - Sales charts and trends
  - Quick action links

- **📦 Inventory Management**
  - Product CRUD operations
  - Stock level monitoring
  - Automated low stock alerts
  - Purchase order generation

- **👥 Customer & User Management**
  - Customer information management
  - Email campaign tools
  - User role assignment
  - Permission matrix control

- **📋 Order Management**
  - Order status updates
  - Shipping label generation
  - Packing slip creation

- **📊 Advanced Reporting**
  - Comprehensive sales analytics
  - Inventory reports
  - Export capabilities (CSV, PDF)

</details>

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern component-based architecture
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust relational database
- **Real-time subscriptions** - Live data updates
- **Edge Functions** - Serverless functions

### Payment Integration
- **Yoco** - South African payment gateway
- **Paystack** - African payment solutions

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **GitHub Actions** - CI/CD pipeline

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nontandomkhz/BestBrightness.git
   cd BestBrightness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_YOCO_PUBLIC_KEY=your_yoco_public_key
   VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   ```

4. **Database setup**
   ```bash
   # Run Supabase migrations
   npx supabase db push
   
   # Seed sample data (optional)
   npx supabase db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Customer Interface: `http://localhost:5173`
   - Cashier Interface: `http://localhost:5173/cashier`
   - Admin Interface: `http://localhost:5173/admin`

---

## 📁 Project Structure

```
Project File Structure
ecommerce-system/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── tests.yml
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── feature_request.md
│       └── user_story.md
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── images/
│   │   ├── products/
│   │   ├── promotions/
│   │   └── placeholders/
│   └── icons/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navigation.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── UI/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   ├── Pagination.jsx
│   │   │   │   ├── SearchBox.jsx
│   │   │   │   ├── FilterDropdown.jsx
│   │   │   │   └── LoadingOverlay.jsx
│   │   │   ├── Forms/
│   │   │   │   ├── FormField.jsx
│   │   │   │   ├── FormSelect.jsx
│   │   │   │   ├── FormCheckbox.jsx
│   │   │   │   ├── FormTextarea.jsx
│   │   │   │   └── ValidationMessage.jsx
│   │   │   └── Tables/
│   │   │       ├── DataTable.jsx
│   │   │       ├── TableRow.jsx
│   │   │       ├── TableHeader.jsx
│   │   │       └── TablePagination.jsx
│   │   ├── customer/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── ProductSearch.jsx
│   │   │   ├── ShoppingCart/
│   │   │   │   ├── CartItem.jsx
│   │   │   │   ├── CartSummary.jsx
│   │   │   │   ├── CartDrawer.jsx
│   │   │   │   └── MiniCart.jsx
│   │   │   ├── Checkout/
│   │   │   │   ├── CheckoutForm.jsx
│   │   │   │   ├── PaymentForm.jsx
│   │   │   │   ├── ShippingForm.jsx
│   │   │   │   ├── OrderSummary.jsx
│   │   │   │   └── StepIndicator.jsx
│   │   │   ├── Account/
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── OrderHistory.jsx
│   │   │   │   ├── OrderDetails.jsx
│   │   │   │   └── AddressBook.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   └── ResetPasswordForm.jsx
│   │   │   ├── Homepage/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── FeaturedProducts.jsx
│   │   │   │   ├── PromotionBanner.jsx
│   │   │   │   ├── CategoryShowcase.jsx
│   │   │   │   └── NewsletterSignup.jsx
│   │   │   └── Reviews/
│   │   │       ├── ReviewForm.jsx
│   │   │       ├── ReviewsList.jsx
│   │   │       └── StarRating.jsx
│   │   ├── cashier/
│   │   │   ├── POS/
│   │   │   │   ├── POSInterface.jsx
│   │   │   │   ├── ProductScanner.jsx
│   │   │   │   ├── POSCart.jsx
│   │   │   │   ├── PaymentTerminal.jsx
│   │   │   │   ├── ReceiptPrinter.jsx
│   │   │   │   └── CashDrawer.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── CashierDashboard.jsx
│   │   │   │   ├── SalesMetrics.jsx
│   │   │   │   └── RecentTransactions.jsx
│   │   │   ├── Reports/
│   │   │   │   ├── DailySalesReport.jsx
│   │   │   │   ├── WeeklySalesReport.jsx
│   │   │   │   └── MonthlySalesReport.jsx
│   │   │   └── Auth/
│   │   │       └── CashierLogin.jsx
│   │   └── admin/
│   │       ├── Dashboard/
│   │       │   ├── AdminDashboard.jsx
│   │       │   ├── MetricsCards.jsx
│   │       │   ├── SalesChart.jsx
│   │       │   ├── InventoryAlerts.jsx
│   │       │   └── RecentOrders.jsx
│   │       ├── Inventory/
│   │       │   ├── ProductManagement.jsx
│   │       │   ├── ProductForm.jsx
│   │       │   ├── StockManager.jsx
│   │       │   ├── LowStockAlerts.jsx
│   │       │   ├── InventoryReports.jsx
│   │       │   └── PurchaseOrders.jsx
│   │       ├── Orders/
│   │       │   ├── OrderManagement.jsx
│   │       │   ├── OrderDetails.jsx
│   │       │   ├── OrderStatusUpdater.jsx
│   │       │   ├── ShippingLabels.jsx
│   │       │   └── PackingSlips.jsx
│   │       ├── Customers/
│   │       │   ├── CustomerManagement.jsx
│   │       │   ├── CustomerDetails.jsx
│   │       │   ├── CustomerHistory.jsx
│   │       │   └── EmailCampaigns.jsx
│   │       ├── Users/
│   │       │   ├── UserManagement.jsx
│   │       │   ├── UserForm.jsx
│   │       │   ├── RoleAssignment.jsx
│   │       │   └── PermissionMatrix.jsx
│   │       ├── Reports/
│   │       │   ├── SalesReports.jsx
│   │       │   ├── InventoryReports.jsx
│   │       │   ├── CustomerReports.jsx
│   │       │   ├── ReportFilters.jsx
│   │       │   └── ExportManager.jsx
│   │       └── Auth/
│   │           ├── AdminLogin.jsx
│   │           └── TwoFactorAuth.jsx
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── OrderHistoryPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ForgotPasswordPage.jsx
│   │   ├── cashier/
│   │   │   ├── CashierDashboard.jsx
│   │   │   ├── POSPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── CashierLoginPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── InventoryPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── UsersPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── AdminLoginPage.jsx
│   │   └── common/
│   │       ├── NotFoundPage.jsx
│   │       ├── UnauthorizedPage.jsx
│   │       └── ErrorPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js
│   │   ├── useOrders.js
│   │   ├── useInventory.js
│   │   ├── useCustomers.js
│   │   ├── usePayment.js
│   │   ├── useReports.js
│   │   ├── useSearch.js
│   │   ├── usePagination.js
│   │   ├── useLocalStorage.js
│   │   ├── useDebounce.js
│   │   └── usePermissions.js
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── orders.js
│   │   │   ├── customers.js
│   │   │   ├── inventory.js
│   │   │   ├── users.js
│   │   │   └── reports.js
│   │   ├── payments/
│   │   │   ├── yoco.js
│   │   │   ├── paystack.js
│   │   │   └── paymentGateway.js
│   │   ├── supabase/
│   │   │   ├── client.js
│   │   │   ├── auth.js
│   │   │   ├── database.js
│   │   │   ├── storage.js
│   │   │   └── realtime.js
│   │   ├── email/
│   │   │   ├── templates.js
│   │   │   └── sender.js
│   │   └── utils/
│   │       ├── encryption.js
│   │       ├── validation.js
│   │       ├── formatters.js
│   │       └── constants.js
│   ├── store/
│   │   ├── index.js
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── cartSlice.js
│   │   │   ├── productsSlice.js
│   │   │   ├── ordersSlice.js
│   │   │   ├── inventorySlice.js
│   │   │   ├── customersSlice.js
│   │   │   └── uiSlice.js
│   │   └── middleware/
│   │       ├── authMiddleware.js
│   │       └── persistMiddleware.js
│   ├── types/
│   │   ├── auth.types.js
│   │   ├── product.types.js
│   │   ├── order.types.js
│   │   ├── customer.types.js
│   │   ├── inventory.types.js
│   │   ├── user.types.js
│   │   ├── payment.types.js
│   │   ├── report.types.js
│   │   └── api.types.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── dateUtils.js
│   │   ├── priceUtils.js
│   │   ├── imageUtils.js
│   │   └── exportUtils.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── utilities.css
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.js
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_products_table.sql
│   │   ├── 003_orders_table.sql
│   │   ├── 004_customers_table.sql
│   │   ├── 005_inventory_table.sql
│   │   ├── 006_users_table.sql
│   │   └── 007_reports_views.sql
│   ├── functions/
│   │   ├── auth-hooks/
│   │   ├── payment-webhook/
│   │   └── email-notifications/
│   ├── seed/
│   │   ├── products.sql
│   │   ├── categories.sql
│   │   └── sample_data.sql
│   └── config.toml
├── docs/
│   ├── setup.md
│   ├── deployment.md
│   ├── api-documentation.md
│   ├── user-guides/
│   │   ├── customer-guide.md
│   │   ├── cashier-guide.md
│   │   └── admin-guide.md
│   └── development/
│       ├── coding-standards.md
│       ├── component-guidelines.md
│       └── testing-strategy.md
├── tests/
│   ├── __mocks__/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── setup.js
│   └── test-utils.jsx
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── jsconfig.json
├── eslint.config.js
├── prettier.config.js
├── vitest.config.js
└── README.md

```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

---

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
npm run deploy:vercel
```

### Deploy to Netlify
```bash
npm run deploy:netlify
```

---

## 📖 Documentation

- [📋 Setup Guide](./docs/setup.md)
- [🚀 Deployment Guide](./docs/deployment.md)
- [📡 API Documentation](./docs/api-documentation.md)
- [👤 User Guides](./docs/user-guides/)
- [💻 Development Guidelines](./docs/development/)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Nontando Mkhize**
- GitHub: [@Nontandomkhz](https://github.com/Nontandomkhz)

---

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Special thanks to the open-source community
- Inspired by the need for efficient e-commerce solutions

---

<div align="center">

### 🌟 Star this repository if you find it helpful!

[![GitHub stars](https://img.shields.io/github/stars/Nontandomkhz/BestBrightness?style=social)](https://github.com/Nontandomkhz/BestBrightness/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Nontandomkhz/BestBrightness?style=social)](https://github.com/Nontandomkhz/BestBrightness/network)

**Made with 💡 by Best Brightness Team**

</div>
