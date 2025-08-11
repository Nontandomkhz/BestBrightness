# 🌟 Best Brightness - Frontend User Stories & Database Models

## Table of Contents
- [Database Schema](#database-schema)
- [Customer User Stories](#customer-user-stories)
- [Cashier User Stories](#cashier-user-stories)
- [Admin User Stories](#admin-user-stories)
- [Cross-Role User Stories](#cross-role-user-stories)

---

## 📊 Database Schema

### Core Entity Models

#### 1. Users Table
```sql
users {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  email: VARCHAR(255) UNIQUE NOT NULL
  password_hash: VARCHAR(255) NOT NULL
  role: user_role NOT NULL DEFAULT 'customer'
  first_name: VARCHAR(100) NOT NULL
  last_name: VARCHAR(100) NOT NULL
  phone: VARCHAR(20)
  avatar_url: TEXT
  is_active: BOOLEAN DEFAULT TRUE
  email_verified: BOOLEAN DEFAULT FALSE
  email_verification_token: VARCHAR(255)
  password_reset_token: VARCHAR(255)
  password_reset_expires: TIMESTAMP
  last_login: TIMESTAMP
  login_attempts: INTEGER DEFAULT 0
  locked_until: TIMESTAMP
  two_factor_enabled: BOOLEAN DEFAULT FALSE
  two_factor_secret: VARCHAR(32)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 2. User Profiles Table
```sql
user_profiles {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id: UUID REFERENCES users(id) ON DELETE CASCADE
  date_of_birth: DATE
  gender: gender_type
  preferences: JSONB DEFAULT '{}'
  marketing_consent: BOOLEAN DEFAULT FALSE
  language: VARCHAR(10) DEFAULT 'en'
  timezone: VARCHAR(50) DEFAULT 'UTC'
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 3. Categories Table
```sql
categories {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name: VARCHAR(100) NOT NULL
  slug: VARCHAR(120) UNIQUE NOT NULL
  description: TEXT
  parent_id: UUID REFERENCES categories(id)
  image_url: TEXT
  icon: VARCHAR(50)
  sort_order: INTEGER DEFAULT 0
  is_active: BOOLEAN DEFAULT TRUE
  seo_title: VARCHAR(200)
  seo_description: TEXT
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 4. Products Table
```sql
products {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  sku: VARCHAR(50) UNIQUE NOT NULL
  name: VARCHAR(255) NOT NULL
  slug: VARCHAR(280) UNIQUE NOT NULL
  description: TEXT
  short_description: TEXT
  category_id: UUID REFERENCES categories(id)
  brand: VARCHAR(100)
  price: DECIMAL(10,2) NOT NULL
  cost_price: DECIMAL(10,2)
  compare_at_price: DECIMAL(10,2)
  weight: DECIMAL(8,2)
  dimensions: JSONB
  barcode: VARCHAR(50)
  status: product_status DEFAULT 'active'
  is_featured: BOOLEAN DEFAULT FALSE
  requires_shipping: BOOLEAN DEFAULT TRUE
  is_taxable: BOOLEAN DEFAULT TRUE
  tax_rate: DECIMAL(5,4) DEFAULT 0.15
  tags: TEXT[]
  attributes: JSONB DEFAULT '{}'
  seo_title: VARCHAR(200)
  seo_description: TEXT
  rating_average: DECIMAL(3,2) DEFAULT 0
  rating_count: INTEGER DEFAULT 0
  view_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
  created_by: UUID REFERENCES users(id)
}
```

#### 5. Product Images Table
```sql
product_images {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  product_id: UUID REFERENCES products(id) ON DELETE CASCADE
  url: TEXT NOT NULL
  alt_text: VARCHAR(255)
  sort_order: INTEGER DEFAULT 0
  is_primary: BOOLEAN DEFAULT FALSE
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 6. Inventory Table
```sql
inventory {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  product_id: UUID REFERENCES products(id) ON DELETE CASCADE
  quantity: INTEGER NOT NULL DEFAULT 0
  reserved_quantity: INTEGER DEFAULT 0
  reorder_point: INTEGER DEFAULT 10
  reorder_quantity: INTEGER DEFAULT 50
  location: VARCHAR(100)
  cost_per_unit: DECIMAL(10,2)
  last_counted: TIMESTAMP
  notes: TEXT
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 7. Inventory Movements Table
```sql
inventory_movements {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  product_id: UUID REFERENCES products(id)
  movement_type: movement_type NOT NULL
  quantity: INTEGER NOT NULL
  previous_quantity: INTEGER NOT NULL
  new_quantity: INTEGER NOT NULL
  reference_id: UUID
  reference_type: VARCHAR(50)
  reason: VARCHAR(255)
  cost_per_unit: DECIMAL(10,2)
  notes: TEXT
  created_by: UUID REFERENCES users(id)
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 8. Addresses Table
```sql
addresses {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id: UUID REFERENCES users(id) ON DELETE CASCADE
  type: address_type NOT NULL
  first_name: VARCHAR(100) NOT NULL
  last_name: VARCHAR(100) NOT NULL
  company: VARCHAR(100)
  address_line_1: VARCHAR(255) NOT NULL
  address_line_2: VARCHAR(255)
  city: VARCHAR(100) NOT NULL
  state_province: VARCHAR(100) NOT NULL
  postal_code: VARCHAR(20) NOT NULL
  country_code: VARCHAR(2) NOT NULL DEFAULT 'ZA'
  phone: VARCHAR(20)
  is_default: BOOLEAN DEFAULT FALSE
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 9. Orders Table
```sql
orders {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  order_number: VARCHAR(50) UNIQUE NOT NULL
  customer_id: UUID REFERENCES users(id)
  status: order_status NOT NULL DEFAULT 'pending'
  payment_status: payment_status NOT NULL DEFAULT 'pending'
  fulfillment_status: fulfillment_status DEFAULT 'unfulfilled'
  channel: order_channel NOT NULL DEFAULT 'online'
  currency: VARCHAR(3) DEFAULT 'ZAR'
  subtotal: DECIMAL(10,2) NOT NULL
  tax_amount: DECIMAL(10,2) DEFAULT 0
  shipping_amount: DECIMAL(10,2) DEFAULT 0
  discount_amount: DECIMAL(10,2) DEFAULT 0
  total_amount: DECIMAL(10,2) NOT NULL
  notes: TEXT
  tags: TEXT[]
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
  shipped_at: TIMESTAMP
  delivered_at: TIMESTAMP
  cancelled_at: TIMESTAMP
  cancellation_reason: TEXT
  processed_by: UUID REFERENCES users(id)
}
```

#### 10. Order Items Table
```sql
order_items {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  order_id: UUID REFERENCES orders(id) ON DELETE CASCADE
  product_id: UUID REFERENCES products(id)
  product_name: VARCHAR(255) NOT NULL
  product_sku: VARCHAR(50) NOT NULL
  quantity: INTEGER NOT NULL
  unit_price: DECIMAL(10,2) NOT NULL
  total_price: DECIMAL(10,2) NOT NULL
  tax_rate: DECIMAL(5,4) DEFAULT 0
  tax_amount: DECIMAL(10,2) DEFAULT 0
  discount_amount: DECIMAL(10,2) DEFAULT 0
  product_snapshot: JSONB
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 11. Shopping Carts Table
```sql
shopping_carts {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  user_id: UUID REFERENCES users(id) ON DELETE CASCADE
  session_id: VARCHAR(255)
  expires_at: TIMESTAMP
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 12. Cart Items Table
```sql
cart_items {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  cart_id: UUID REFERENCES shopping_carts(id) ON DELETE CASCADE
  product_id: UUID REFERENCES products(id) ON DELETE CASCADE
  quantity: INTEGER NOT NULL DEFAULT 1
  unit_price: DECIMAL(10,2) NOT NULL
  added_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 13. Payments Table
```sql
payments {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  order_id: UUID REFERENCES orders(id)
  payment_method: payment_method NOT NULL
  gateway: payment_gateway NOT NULL
  gateway_transaction_id: VARCHAR(255)
  status: payment_status NOT NULL
  amount: DECIMAL(10,2) NOT NULL
  currency: VARCHAR(3) DEFAULT 'ZAR'
  gateway_response: JSONB
  processed_at: TIMESTAMP
  refunded_at: TIMESTAMP
  refund_amount: DECIMAL(10,2) DEFAULT 0
  failure_reason: TEXT
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 14. Discounts Table
```sql
discounts {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  code: VARCHAR(50) UNIQUE NOT NULL
  name: VARCHAR(255) NOT NULL
  description: TEXT
  type: discount_type NOT NULL
  value: DECIMAL(10,2) NOT NULL
  minimum_order_amount: DECIMAL(10,2)
  maximum_discount_amount: DECIMAL(10,2)
  usage_limit: INTEGER
  usage_limit_per_customer: INTEGER DEFAULT 1
  times_used: INTEGER DEFAULT 0
  starts_at: TIMESTAMP NOT NULL
  ends_at: TIMESTAMP
  is_active: BOOLEAN DEFAULT TRUE
  applicable_products: UUID[]
  applicable_categories: UUID[]
  created_by: UUID REFERENCES users(id)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 15. Reviews Table
```sql
reviews {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  product_id: UUID REFERENCES products(id) ON DELETE CASCADE
  customer_id: UUID REFERENCES users(id) ON DELETE CASCADE
  order_id: UUID REFERENCES orders(id)
  rating: INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)
  title: VARCHAR(255)
  content: TEXT
  is_verified_purchase: BOOLEAN DEFAULT FALSE
  is_approved: BOOLEAN DEFAULT FALSE
  helpful_count: INTEGER DEFAULT 0
  reported_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
  moderated_by: UUID REFERENCES users(id)
  moderated_at: TIMESTAMP
}
```

#### 16. Audit Logs Table
```sql
audit_logs {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  table_name: VARCHAR(50) NOT NULL
  record_id: UUID NOT NULL
  action: audit_action NOT NULL
  old_values: JSONB
  new_values: JSONB
  user_id: UUID REFERENCES users(id)
  user_email: VARCHAR(255)
  ip_address: INET
  user_agent: TEXT
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 17. System Settings Table
```sql
system_settings {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  key: VARCHAR(100) UNIQUE NOT NULL
  value: JSONB NOT NULL
  description: TEXT
  is_public: BOOLEAN DEFAULT FALSE
  updated_by: UUID REFERENCES users(id)
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

### Enums and Types

```sql
-- User role enum
CREATE TYPE user_role AS ENUM ('customer', 'cashier', 'admin', 'super_admin');

-- Gender enum
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- Product status enum
CREATE TYPE product_status AS ENUM ('draft', 'active', 'inactive', 'archived');

-- Address type enum
CREATE TYPE address_type AS ENUM ('billing', 'shipping', 'both');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded');

-- Fulfillment status enum
CREATE TYPE fulfillment_status AS ENUM ('unfulfilled', 'partial', 'fulfilled', 'shipped', 'delivered');

-- Order channel enum
CREATE TYPE order_channel AS ENUM ('online', 'pos', 'phone', 'email');

-- Payment method enum
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'cash', 'bank_transfer', 'mobile_money');

-- Payment gateway enum
CREATE TYPE payment_gateway AS ENUM ('yoco', 'paystack', 'stripe', 'paypal');

-- Discount type enum
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');

-- Movement type enum
CREATE TYPE movement_type AS ENUM ('in', 'out', 'adjustment', 'transfer', 'damaged', 'returned');

-- Audit action enum
CREATE TYPE audit_action AS ENUM ('create', 'update', 'delete', 'login', 'logout');
```

### Indexes for Performance

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Product indexes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_products_name_search ON products USING gin(to_tsvector('english', name));

-- Order indexes
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Inventory indexes
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);

-- Cart indexes
CREATE INDEX idx_carts_user ON shopping_carts(user_id);
CREATE INDEX idx_carts_session ON shopping_carts(session_id);
```

---



## 👥 Customer User Stories

### Authentication & Account Management

**Story C-001**: Account Registration
- **As a** potential customer
- **I want to** create a new account with email verification
- **So that** I can access personalized features and make purchases
- **Implementation Files:**
  - **Page:** `src/pages/auth/Register.jsx`
  - **Components:** `src/components/forms/RegisterForm.jsx`
  - **Services:** `src/services/authService.js`
  - **Store:** `src/store/authSlice.js`
  - **Database:** `users`, `user_profiles`

**Story C-002**: Secure Login
- **As a** returning customer
- **I want to** securely login to my account
- **So that** I can access my personal information and order history
- **Implementation Files:**
  - **Page:** `src/pages/auth/Login.jsx`
  - **Components:** `src/components/forms/LoginForm.jsx`
  - **Services:** `src/services/authService.js`
  - **Store:** `src/store/authSlice.js`
  - **Routes:** `src/routes/PrivateRoute.jsx`, `src/routes/RoleRoute.jsx`
  - **Database:** `users`, `audit_logs`

**Story C-003**: Password Reset
- **As a** customer who forgot my password
- **I want to** reset my password via email
- **So that** I can regain access to my account
- **Implementation Files:**
  - **Page:** `src/pages/auth/Login.jsx` (forgot password link)
  - **Components:** `src/components/forms/PasswordResetForm.jsx`
  - **Services:** `src/services/authService.js`
  - **Database:** `users` (password_reset_token, password_reset_expires)

**Story C-004**: Profile Management
- **As a** logged-in customer
- **I want to** update my profile information
- **So that** I can keep my account details current
- **Implementation Files:**
  - **Page:** `src/pages/customer/Account.jsx`
  - **Components:** `src/components/forms/ProfileForm.jsx`
  - **Services:** `src/services/authService.js`
  - **Hooks:** `src/hooks/useAuth.js`
  - **Store:** `src/store/authSlice.js`
  - **Database:** `users`, `user_profiles`

### Product Discovery & Browsing

**Story C-005**: Homepage Experience
- **As a** visitor
- **I want to** see an engaging homepage with featured products
- **So that** I can quickly discover popular and recommended items
- **Implementation Files:**
  - **Page:** `src/pages/customer/Home.jsx`
  - **Components:** 
    - `src/components/FeaturedProducts.jsx`
    - `src/components/ProductCarousel.jsx`
    - `src/components/PromotionBanner.jsx`
  - **Services:** `src/services/productService.js`
  - **Hooks:** `src/hooks/useProducts.js`
  - **Database:** `products`, `categories`

**Story C-006**: Product Search
- **As a** customer
- **I want to** search for products by name, category, or keywords
- **So that** I can quickly find what I'm looking for
- **Implementation Files:**
  - **Page:** `src/pages/customer/Products.jsx`
  - **Components:** 
    - `src/components/forms/SearchBox.jsx`
    - `src/components/SearchResults.jsx`
    - `src/components/SearchSuggestions.jsx`
  - **Services:** `src/services/productService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/useDebounce.js`
  - **Store:** `src/store/productSlice.js`
  - **Database:** `products`, `categories`

**Story C-007**: Product Listing
- **As a** customer
- **I want to** browse products in grid and list views
- **So that** I can compare products efficiently
- **Implementation Files:**
  - **Page:** `src/pages/customer/Products.jsx`
  - **Components:** 
    - `src/components/ProductGrid.jsx`
    - `src/components/ProductCard.jsx`
    - `src/components/forms/FilterDropdown.jsx`
    - `src/components/ui/Pagination.jsx`
  - **Services:** `src/services/productService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/usePagination.js`
  - **Store:** `src/store/productSlice.js`
  - **Database:** `products`, `categories`, `product_images`

**Story C-008**: Product Details
- **As a** customer
- **I want to** view detailed product information
- **So that** I can make informed purchasing decisions
- **Implementation Files:**
  - **Page:** `src/pages/customer/ProductDetails.jsx`
  - **Components:** 
    - `src/components/ProductGallery.jsx`
    - `src/components/ProductInfo.jsx`
    - `src/components/ProductReviews.jsx`
    - `src/components/RelatedProducts.jsx`
    - `src/components/AddToCartButton.jsx`
  - **Services:** `src/services/productService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/useCart.js`
  - **Store:** `src/store/productSlice.js`, `src/store/cartSlice.js`
  - **Database:** `products`, `product_images`, `reviews`, `inventory`

### Shopping Cart & Checkout

**Story C-009**: Add to Cart
- **As a** customer
- **I want to** add products to my shopping cart
- **So that** I can collect items before purchase
- **Implementation Files:**
  - **Components:** 
    - `src/components/AddToCartButton.jsx`
    - `src/components/QuantitySelector.jsx`
    - `src/components/layout/CartIcon.jsx`
  - **Services:** `src/services/cartService.js`
  - **Hooks:** `src/hooks/useCart.js`
  - **Store:** `src/store/cartSlice.js`
  - **Database:** `shopping_carts`, `cart_items`, `products`, `inventory`

**Story C-010**: Shopping Cart Management
- **As a** customer
- **I want to** view and modify items in my cart
- **So that** I can review my selections before checkout
- **Implementation Files:**
  - **Page:** `src/pages/customer/Cart.jsx`
  - **Components:** 
    - `src/components/CartItem.jsx`
    - `src/components/CartSummary.jsx`
    - `src/components/DiscountCodeForm.jsx`
    - `src/components/SaveForLater.jsx`
  - **Services:** `src/services/cartService.js`
  - **Hooks:** `src/hooks/useCart.js`
  - **Store:** `src/store/cartSlice.js`
  - **Database:** `shopping_carts`, `cart_items`, `products`, `discounts`

**Story C-011**: Checkout Process
- **As a** customer
- **I want to** complete my purchase securely
- **So that** I can receive my ordered products
- **Implementation Files:**
  - **Page:** `src/pages/customer/Checkout.jsx`
  - **Components:** 
    - `src/components/forms/CheckoutForm.jsx`
    - `src/components/forms/AddressForm.jsx`
    - `src/components/PaymentForm.jsx`
    - `src/components/OrderSummary.jsx`
    - `src/components/CheckoutSteps.jsx`
  - **Services:** `src/services/orderService.js`, `src/services/paymentService.js`
  - **Hooks:** `src/hooks/useOrders.js`
  - **Store:** `src/store/orderSlice.js`
  - **Database:** `orders`, `order_items`, `addresses`, `payments`, `discounts`

**Story C-012**: Order History
- **As a** customer
- **I want to** view my order history
- **So that** I can track purchases and reorder items
- **Implementation Files:**
  - **Page:** `src/pages/customer/Orders.jsx`
  - **Components:** 
    - `src/components/OrderCard.jsx`
    - `src/components/OrderDetails.jsx`
    - `src/components/OrderStatus.jsx`
    - `src/components/ReorderButton.jsx`
  - **Services:** `src/services/orderService.js`
  - **Hooks:** `src/hooks/useOrders.js`
  - **Store:** `src/store/orderSlice.js`
  - **Database:** `orders`, `order_items`, `products`, `payments`

---

## 💰 Cashier User Stories

### POS Operations

**Story CA-001**: Cashier Authentication
- **As a** cashier
- **I want to** securely login to the POS system
- **So that** I can access cashier-specific functions
- **Implementation Files:**
  - **Page:** `src/pages/auth/Login.jsx` (shared login page)
  - **Components:** `src/components/forms/LoginForm.jsx`
  - **Services:** `src/services/authService.js`
  - **Store:** `src/store/authSlice.js`
  - **Routes:** `src/routes/RoleRoute.jsx`
  - **Database:** `users`, `user_profiles`, `audit_logs`

**Story CA-002**: POS Dashboard
- **As a** cashier
- **I want to** see a dashboard with key information
- **So that** I can quickly access important functions
- **Implementation Files:**
  - **Page:** `src/pages/cashier/Dashboard.jsx`
  - **Components:** 
    - `src/components/DashboardStats.jsx`
    - `src/components/QuickActions.jsx`
    - `src/components/TodaysSales.jsx`
    - `src/components/LowStockAlerts.jsx`
  - **Services:** `src/services/reportService.js`
  - **Hooks:** `src/hooks/useReports.js`
  - **Database:** `orders`, `payments`, `products`, `inventory`

**Story CA-003**: Product Search in POS
- **As a** cashier
- **I want to** quickly find products during checkout
- **So that** I can efficiently process customer purchases
- **Implementation Files:**
  - **Page:** `src/pages/cashier/POS.jsx`
  - **Components:** 
    - `src/components/forms/SearchBox.jsx`
    - `src/components/ProductSearch.jsx`
    - `src/components/BarcodeScanner.jsx`
    - `src/components/CategoryBrowser.jsx`
  - **Services:** `src/services/productService.js`
  - **Hooks:** `src/hooks/useProducts.js`
  - **Store:** `src/store/productSlice.js`
  - **Database:** `products`, `inventory`, `categories`

**Story CA-004**: POS Cart Management
- **As a** cashier
- **I want to** manage items in the POS cart
- **So that** I can accurately process customer orders
- **Implementation Files:**
  - **Page:** `src/pages/cashier/POS.jsx`
  - **Components:** 
    - `src/components/POSCart.jsx`
    - `src/components/CartItem.jsx`
    - `src/components/DiscountSelector.jsx`
    - `src/components/TaxCalculator.jsx`
  - **Services:** `src/services/cartService.js`
  - **Hooks:** `src/hooks/useCart.js`
  - **Store:** `src/store/cartSlice.js`
  - **Database:** `products`, `discounts`, `inventory`

**Story CA-005**: Payment Processing
- **As a** cashier
- **I want to** process different payment methods
- **So that** I can complete customer transactions
- **Implementation Files:**
  - **Page:** `src/pages/cashier/POS.jsx`
  - **Components:** 
    - `src/components/PaymentModal.jsx`
    - `src/components/CashPayment.jsx`
    - `src/components/CardPayment.jsx`
    - `src/components/ReceiptPreview.jsx`
  - **Services:** `src/services/paymentService.js`, `src/services/orderService.js`
  - **Hooks:** `src/hooks/useOrders.js`
  - **Store:** `src/store/orderSlice.js`
  - **Database:** `payments`, `orders`, `order_items`

### Sales Reporting

**Story CA-006**: Daily Sales Report
- **As a** cashier
- **I want to** view my daily sales performance
- **So that** I can track my productivity
- **Implementation Files:**
  - **Page:** `src/pages/cashier/Reports.jsx`
  - **Components:** 
    - `src/components/SalesChart.jsx`
    - `src/components/ReportTable.jsx`
    - `src/components/PerformanceMetrics.jsx`
    - `src/components/ExportButton.jsx`
  - **Services:** `src/services/reportService.js`
  - **Hooks:** `src/hooks/useReports.js`
  - **Utils:** `src/utils/exportUtils.js`
  - **Database:** `orders`, `order_items`, `payments`, `users`

---

## ⚙️ Admin User Stories

### Dashboard & Analytics

**Story A-001**: Admin Authentication
- **As an** administrator
- **I want to** securely login with enhanced security
- **So that** I can access sensitive business functions
- **Implementation Files:**
  - **Page:** `src/pages/auth/Login.jsx` (shared login page)
  - **Components:** 
    - `src/components/forms/LoginForm.jsx`
    - `src/components/TwoFactorAuth.jsx`
  - **Services:** `src/services/authService.js`
  - **Store:** `src/store/authSlice.js`
  - **Routes:** `src/routes/RoleRoute.jsx`
  - **Database:** `users`, `user_profiles`, `audit_logs`

**Story A-002**: Executive Dashboard
- **As an** administrator
- **I want to** see key business metrics at a glance
- **So that** I can make informed business decisions
- **Implementation Files:**
  - **Page:** `src/pages/admin/Dashboard.jsx`
  - **Components:** 
    - `src/components/MetricCard.jsx`
    - `src/components/SalesChart.jsx`
    - `src/components/RecentOrders.jsx`
    - `src/components/TopProducts.jsx`
    - `src/components/LowStockAlerts.jsx`
  - **Services:** `src/services/reportService.js`
  - **Hooks:** `src/hooks/useReports.js`
  - **Database:** `orders`, `products`, `users`, `inventory`, `payments`

### Inventory Management

**Story A-003**: Product Management
- **As an** administrator
- **I want to** manage the product catalog
- **So that** I can maintain accurate product information
- **Implementation Files:**
  - **Page:** `src/pages/admin/Inventory.jsx`
  - **Components:** 
    - `src/components/ProductForm.jsx`
    - `src/components/ProductTable.jsx`
    - `src/components/ImageUpload.jsx`
    - `src/components/CategorySelector.jsx`
    - `src/components/BulkImport.jsx`
  - **Services:** `src/services/productService.js`, `src/services/inventoryService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/useInventory.js`
  - **Store:** `src/store/productSlice.js`, `src/store/inventorySlice.js`
  - **Utils:** `src/utils/imageUtils.js`
  - **Database:** `products`, `categories`, `product_images`, `inventory`

**Story A-004**: Inventory Tracking
- **As an** administrator
- **I want to** monitor stock levels across all products
- **So that** I can prevent stockouts and overstock
- **Implementation Files:**
  - **Page:** `src/pages/admin/Inventory.jsx`
  - **Components:** 
    - `src/components/StockTable.jsx`
    - `src/components/StockAlerts.jsx`
    - `src/components/InventoryMovements.jsx`
    - `src/components/StockCountForm.jsx`
  - **Services:** `src/services/inventoryService.js`
  - **Hooks:** `src/hooks/useInventory.js`
  - **Store:** `src/store/inventorySlice.js`
  - **Database:** `inventory`, `inventory_movements`, `products`

**Story A-005**: Purchase Orders
- **As an** administrator
- **I want to** generate purchase orders for restocking
- **So that** I can maintain optimal inventory levels
- **Implementation Files:**
  - **Page:** `src/pages/admin/PurchaseOrders.jsx` (new page)
  - **Components:** 
    - `src/components/POForm.jsx`
    - `src/components/SupplierSelector.jsx`
    - `src/components/POTable.jsx`
    - `src/components/ReorderSuggestions.jsx`
  - **Services:** `src/services/purchaseOrderService.js` (new service)
  - **Database:** `inventory`, `products`, `suppliers` (new table), `purchase_orders` (new table)

### Order Management

**Story A-006**: Order Overview
- **As an** administrator
- **I want to** view and manage all customer orders
- **So that** I can ensure timely order fulfillment
- **Implementation Files:**
  - **Page:** `src/pages/admin/Orders.jsx`
  - **Components:** 
    - `src/components/OrderTable.jsx`
    - `src/components/OrderFilters.jsx`
    - `src/components/OrderDetails.jsx`
    - `src/components/OrderStatusUpdate.jsx`
    - `src/components/BulkOrderActions.jsx`
  - **Services:** `src/services/orderService.js`
  - **Hooks:** `src/hooks/useOrders.js`
  - **Store:** `src/store/orderSlice.js`
  - **Database:** `orders`, `order_items`, `users`, `addresses`, `payments`

**Story A-007**: Shipping Management
- **As an** administrator
- **I want to** manage order fulfillment and shipping
- **So that** customers receive their orders promptly
- **Implementation Files:**
  - **Page:** `src/pages/admin/Orders.jsx`
  - **Components:** 
    - `src/components/ShippingForm.jsx`
    - `src/components/ShippingLabel.jsx`
    - `src/components/TrackingNumber.jsx`
    - `src/components/BatchShipping.jsx`
  - **Services:** `src/services/shippingService.js` (new service)
  - **Database:** `orders`, `shipments` (new table), `addresses`

### User & Customer Management

**Story A-008**: Staff Management
- **As an** administrator
- **I want to** manage staff user accounts
- **So that** I can control system access and permissions
- **Implementation Files:**
  - **Page:** `src/pages/admin/Users.jsx`
  - **Components:** 
    - `src/components/UserForm.jsx`
    - `src/components/UserTable.jsx`
    - `src/components/RoleSelector.jsx`
    - `src/components/PermissionMatrix.jsx`
    - `src/components/UserActivity.jsx`
  - **Services:** `src/services/userService.js` (new service)
  - **Database:** `users`, `user_profiles`, `roles` (new table), `permissions` (new table)

**Story A-009**: Customer Management
- **As an** administrator
- **I want to** manage customer accounts and relationships
- **So that** I can provide better customer service
- **Implementation Files:**
  - **Page:** `src/pages/admin/Customers.jsx`
  - **Components:** 
    - `src/components/CustomerProfile.jsx`
    - `src/components/CustomerOrders.jsx`
    - `src/components/CustomerSegments.jsx`
    - `src/components/CustomerCommunication.jsx`
  - **Services:** `src/services/customerService.js` (new service)
  - **Database:** `users`, `orders`, `reviews`, `addresses`

### Advanced Reporting

**Story A-010**: Sales Analytics
- **As an** administrator
- **I want to** analyze sales performance across multiple dimensions
- **So that** I can identify trends and opportunities
- **Implementation Files:**
  - **Page:** `src/pages/admin/Reports.jsx`
  - **Components:** 
    - `src/components/AnalyticsCharts.jsx`
    - `src/components/ReportBuilder.jsx`
    - `src/components/SalesTrends.jsx`
    - `src/components/CustomerAnalytics.jsx`
  - **Services:** `src/services/reportService.js`
  - **Hooks:** `src/hooks/useReports.js`
  - **Utils:** `src/utils/exportUtils.js`
  - **Database:** `orders`, `order_items`, `products`, `categories`, `users`

**Story A-011**: Inventory Reports
- **As an** administrator
- **I want to** generate comprehensive inventory reports
- **So that** I can optimize stock management
- **Implementation Files:**
  - **Page:** `src/pages/admin/Reports.jsx`
  - **Components:** 
    - `src/components/InventoryCharts.jsx`
    - `src/components/StockAnalysis.jsx`
    - `src/components/TurnoverReport.jsx`
    - `src/components/ABCAnalysis.jsx`
  - **Services:** `src/services/inventoryService.js`, `src/services/reportService.js`
  - **Database:** `inventory`, `inventory_movements`, `products`, `orders`

---

## 🔄 Cross-Role User Stories

### System-Wide Features

**Story CR-001**: Real-time Inventory Sync
- **As a** user of any role
- **I want** inventory updates to be reflected immediately across all interfaces
- **So that** stock information is always accurate
- **Implementation Files:**
  - **Services:** `src/services/realtimeService.js` (new service)
  - **Hooks:** `src/hooks/useRealtime.js` (new hook)
  - **Store:** `src/store/inventorySlice.js`
  - **Components:** Real-time updates in all inventory-related components
  - **Database:** `inventory`, `products`, `orders`

**Story CR-002**: Universal Search Functionality
- **As a** user of any role
- **I want** to search for relevant information efficiently
- **So that** I can find what I need quickly
- **Implementation Files:**
  - **Components:** 
    - `src/components/forms/SearchBox.jsx`
    - `src/components/UniversalSearch.jsx`
    - `src/components/SearchResults.jsx`
  - **Services:** `src/services/searchService.js` (new service)
  - **Hooks:** `src/hooks/useSearch.js` (new hook)
  - **Database:** `products`, `orders`, `users`

**Story CR-003**: Notification System
- **As a** user of any role
- **I want** to receive relevant notifications
- **So that** I stay informed about important events
- **Implementation Files:**
  - **Components:** 
    - `src/components/NotificationCenter.jsx`
    - `src/components/feedback/ToastNotification.jsx`
    - `src/components/NotificationBell.jsx`
  - **Services:** `src/services/notificationService.js` (new service)
  - **Hooks:** `src/hooks/useNotifications.js` (new hook)
  - **Store:** `src/store/notificationSlice.js` (new slice)
  - **Database:** `notifications` (new table), `users`

**Story CR-004**: Audit Trail
- **As a** system administrator
- **I want** all user actions to be logged
- **So that** I can maintain security and compliance
- **Implementation Files:**
  - **Services:** `src/services/auditService.js` (new service)
  - **Utils:** `src/utils/auditUtils.js` (new utility)
  - **Pages:** `src/pages/admin/AuditLogs.jsx` (new page)
  - **Components:** 
    - `src/components/AuditTable.jsx`
    - `src/components/AuditFilters.jsx`
  - **Database:** `audit_logs`, `users`

---

## 📋 Implementation Priority

### Phase 1 (MVP - Customer & Basic Admin)
1. **Authentication System** (C-001, C-002, C-003)
2. **Product Catalog** (C-005, C-006, C-007, C-008)
3. **Shopping Cart** (C-009, C-010)
4. **Basic Checkout** (C-011)
5. **Order History** (C-012)
6. **Admin Dashboard** (A-001, A-002)
7. **Basic Product Management** (A-003)

### Phase 2 (Cashier & Advanced Admin)
1. **POS System** (CA-001, CA-002, CA-003, CA-004, CA-005)
2. **Inventory Management** (A-004, A-005)
3. **Order Management** (A-006, A-007)
4. **Basic Reporting** (CA-006, A-010)

### Phase 3 (Advanced Features)
1. **User Management** (A-008, A-009)
2. **Advanced Analytics** (A-011)
3. **Real-time Features** (CR-001, CR-003)
4. **Audit & Compliance** (CR-004)

This comprehensive mapping provides clear guidance for implementation, ensuring each user story has defined components, pages, and database models for successful development.