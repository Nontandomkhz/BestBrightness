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
src/
├── components/
│   ├── layout/
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── Navigation.jsx
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── TextArea.jsx
│   │   ├── Modal.jsx
│   │   ├── Spinner.jsx
│   │   ├── Alert.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── Tabs.jsx
│   │   └── Pagination.jsx
│   ├── forms/
│   │   ├── LoginForm.jsx       # Single login form for all roles
│   │   ├── RegisterForm.jsx
│   │   ├── CheckoutForm.jsx
│   │   ├── SearchBox.jsx
│   │   ├── FilterDropdown.jsx
│   │   └── ValidationMessage.jsx
│   └── feedback/
│       ├── ToastNotification.jsx
│       ├── ConfirmationDialog.jsx
│       └── EmptyState.jsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.jsx            # Universal login page
│   │   └── Register.jsx         # Optional registration page
│   │
│   ├── customer/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   └── Account.jsx
│   │
│   ├── cashier/
│   │   ├── Dashboard.jsx
│   │   ├── POS.jsx
│   │   ├── Payments.jsx
│   │   └── Reports.jsx
│   │
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Inventory.jsx
│   │   ├── Orders.jsx
│   │   ├── Customers.jsx
│   │   ├── Users.jsx
│   │   └── Reports.jsx
│   │
│   └── common/
│       ├── NotFound.jsx
│       ├── Unauthorized.jsx
│       └── ErrorPage.jsx
│
├── routes/
│   ├── AppRoute.jsx              # Handles routing
│   ├── PrivateRoute.jsx          # Protects authenticated routes
│   └── RoleRoute.jsx             # Handles role-based redirection
│
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   ├── useProducts.js
│   ├── useOrders.js
│   ├── useInventory.js
│   ├── useReports.js
│   ├── usePagination.js
│   └── useDebounce.js
│
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── orderService.js
│   ├── inventoryService.js
│   ├── reportService.js
│   └── paymentService.js
│
├── store/
│   ├── index.js
│   ├── authSlice.js              # Stores user & role info
│   ├── cartSlice.js
│   ├── productSlice.js
│   ├── orderSlice.js
│   ├── inventorySlice.js
│   └── uiSlice.js
│
├── utils/
│   ├── constants.js
│   ├── formatters.js
│   ├── validators.js
│   ├── helpers.js
│   ├── dateUtils.js
│   ├── priceUtils.js
│   ├── imageUtils.js
│   └── exportUtils.js
│
├── styles/
│   ├── globals.css
│   └── components.css
│
├── App.jsx
└── main.jsx


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
