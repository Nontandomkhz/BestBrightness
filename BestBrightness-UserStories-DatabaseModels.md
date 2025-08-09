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

**Epic: User Authentication**

**Story C-001**: Account Registration
- **As a** potential customer
- **I want to** create a new account with email verification
- **So that** I can access personalized features and make purchases
- **Acceptance Criteria:**
  - User can enter email, password, first name, and last name
  - Password must meet security requirements (8+ chars, mixed case, number, symbol)
  - Email verification link is sent to user's email
  - User cannot login until email is verified
  - User receives welcome email after verification
  - Form validates input in real-time
  - Clear error messages for validation failures

**Story C-002**: Secure Login
- **As a** returning customer
- **I want to** securely login to my account
- **So that** I can access my personal information and order history
- **Acceptance Criteria:**
  - User can login with email and password
  - Account is locked after 5 failed attempts for 30 minutes
  - "Remember me" option keeps user logged in for 30 days
  - User is redirected to intended page after login
  - Clear error messages for invalid credentials
  - Loading states during authentication

**Story C-003**: Password Reset
- **As a** customer who forgot my password
- **I want to** reset my password via email
- **So that** I can regain access to my account
- **Acceptance Criteria:**
  - User can request password reset with email address
  - Reset link expires after 1 hour
  - User can set new password that meets security requirements
  - Old password is invalidated after successful reset
  - User receives confirmation email after reset
  - Reset link can only be used once

**Story C-004**: Profile Management
- **As a** logged-in customer
- **I want to** update my profile information
- **So that** I can keep my account details current
- **Acceptance Criteria:**
  - User can update first name, last name, phone, and avatar
  - Email changes require verification of new email
  - User can set marketing preferences
  - Changes are saved in real-time with success feedback
  - User can view account activity log
  - Password change requires current password verification

### Product Discovery & Browsing

**Epic: Product Catalog**

**Story C-005**: Homepage Experience
- **As a** visitor
- **I want to** see an engaging homepage with featured products
- **So that** I can quickly discover popular and recommended items
- **Acceptance Criteria:**
  - Homepage displays featured products carousel
  - Current promotions are prominently displayed
  - Category navigation is easily accessible
  - Search bar is prominently placed
  - Page loads in under 3 seconds
  - Mobile-responsive design
  - Social proof elements (reviews, ratings)

**Story C-006**: Product Search
- **As a** customer
- **I want to** search for products by name, category, or keywords
- **So that** I can quickly find what I'm looking for
- **Acceptance Criteria:**
  - Search returns relevant results sorted by relevance
  - Auto-suggestions appear as user types
  - Search handles typos and partial matches
  - No results page suggests alternatives
  - Search history is saved for logged-in users
  - Search filters can be applied to results
  - Search analytics track popular queries

**Story C-007**: Product Listing
- **As a** customer
- **I want to** browse products in grid and list views
- **So that** I can compare products efficiently
- **Acceptance Criteria:**
  - Toggle between grid (3x3) and list views
  - Products show image, name, price, rating
  - Pagination loads 24 products per page
  - Sort options: price, name, rating, newest
  - Filter by category, price range, brand, rating
  - View count and "Add to Cart" on hover
  - Lazy loading for images

**Story C-008**: Product Details
- **As a** customer
- **I want to** view detailed product information
- **So that** I can make informed purchasing decisions
- **Database Models:** `products`, `product_images`, `reviews`, `inventory`
- **Frontend Pages:** `src/pages/customer/ProductDetails.jsx`
- **Components:** `src/components/ProductGallery.jsx`, `src/components/ProductReviews.jsx`
- **Services:** `src/services/productService.js`
- **Acceptance Criteria:**
  - High-quality product images with zoom functionality
  - Detailed product description and specifications
  - Customer reviews and ratings display
  - Related products recommendations
  - Stock availability indicator
  - Price history graph (if available)
  - Social sharing buttons
  - Breadcrumb navigation

### Shopping Cart & Checkout

**Epic: Shopping Experience**

**Story C-009**: Add to Cart
- **As a** customer
- **I want to** add products to my shopping cart
- **So that** I can collect items before purchase
- **Database Models:** `shopping_carts`, `cart_items`, `products`, `inventory`
- **Frontend Pages:** `src/pages/customer/Products.jsx`, `src/pages/customer/ProductDetails.jsx`
- **Components:** `src/components/AddToCartButton.jsx`, `src/components/CartIcon.jsx`
- **Services:** `src/services/cartService.js`
- **Hooks:** `src/hooks/useCart.js`
- **Store:** `src/store/cartSlice.js`
- **Acceptance Criteria:**
  - One-click add to cart from product listing
  - Quantity selector on product detail page
  - Cart icon updates with item count
  - Success animation/feedback when item added
  - Prevents adding out-of-stock items
  - Guest users can add items (session-based cart)
  - Cart persists across browser sessions for logged-in users

**Story C-010**: Shopping Cart Management
- **As a** customer
- **I want to** view and modify items in my cart
- **So that** I can review my selections before checkout
- **Database Models:** `shopping_carts`, `cart_items`, `products`, `discounts`
- **Frontend Pages:** `src/pages/customer/Cart.jsx`
- **Components:** `src/components/CartItem.jsx`, `src/components/CartSummary.jsx`
- **Services:** `src/services/cartService.js`
- **Hooks:** `src/hooks/useCart.js`
- **Store:** `src/store/cartSlice.js`
- **Acceptance Criteria:**
  - Display all cart items with images, names, prices
  - Update quantity with + / - buttons
  - Remove individual items
  - Calculate subtotal, tax, and total
  - Apply discount codes
  - Save for later functionality
  - Empty cart state with suggested products
  - Real-time price updates

**Story C-011**: Checkout Process
- **As a** customer
- **I want to** complete my purchase securely
- **So that** I can receive my ordered products
- **Database Models:** `orders`, `order_items`, `addresses`, `payments`, `discounts`
- **Frontend Pages:** `src/pages/customer/Checkout.jsx`
- **Components:** `src/components/CheckoutForm.jsx`, `src/components/PaymentForm.jsx`, `src/components/AddressForm.jsx`
- **Services:** `src/services/orderService.js`, `src/services/paymentService.js`
- **Acceptance Criteria:**
  - Multi-step checkout (shipping, payment, review)
  - Guest checkout option
  - Address book for logged-in users
  - Multiple payment methods (Yoco, Paystack)
  - Order summary with itemized breakdown
  - Terms and conditions acceptance
  - Order confirmation page with tracking number
  - Email confirmation sent

**Story C-012**: Order History
- **As a** customer
- **I want to** view my order history
- **So that** I can track purchases and reorder items
- **Database Models:** `orders`, `order_items`, `products`, `payments`
- **Frontend Pages:** `src/pages/customer/Orders.jsx`
- **Components:** `src/components/OrderCard.jsx`, `src/components/OrderDetails.jsx`
- **Services:** `src/services/orderService.js`
- **Hooks:** `src/hooks/useOrders.js`
- **Acceptance Criteria:**
  - List all orders with status and total
  - Filter by date range and status
  - Click to view detailed order information
  - Reorder functionality for past orders
  - Download invoices as PDF
  - Track shipment status
  - Return/refund request initiation

---

## 💰 Cashier User Stories

### POS Operations

**Epic: Point of Sale System**

**Story CA-001**: Cashier Authentication
- **As a** cashier
- **I want to** securely login to the POS system
- **So that** I can access cashier-specific functions
- **Database Models:** `users`, `user_profiles`, `audit_logs`
- **Frontend Pages:** `src/pages/auth/Login.jsx`
- **Components:** `src/components/forms/LoginForm.jsx`
- **Services:** `src/services/authService.js`
- **Store:** `src/store/authSlice.js`
- **Routes:** `src/routes/RoleRoute.jsx`
- **Acceptance Criteria:**
  - Role-based login redirects to cashier dashboard
  - Session timeout after 8 hours of inactivity
  - Login attempts logged for security
  - Different UI theme for cashier interface
  - Quick user switching for shared terminals
  - Shift start/end tracking

**Story CA-002**: POS Dashboard
- **As a** cashier
- **I want to** see a dashboard with key information
- **So that** I can quickly access important functions
- **Database Models:** `orders`, `payments`, `products`, `inventory`
- **Frontend Pages:** `src/pages/cashier/Dashboard.jsx`
- **Components:** `src/components/DashboardStats.jsx`, `src/components/QuickActions.jsx`
- **Services:** `src/services/reportService.js`
- **Acceptance Criteria:**
  - Today's sales summary
  - Active promotions display
  - Low stock alerts
  - Quick links to POS and reports
  - Shift summary information
  - Recent transactions list

**Story CA-003**: Product Search in POS
- **As a** cashier
- **I want to** quickly find products during checkout
- **So that** I can efficiently process customer purchases
- **Database Models:** `products`, `inventory`, `categories`
- **Frontend Pages:** `src/pages/cashier/POS.jsx`
- **Components:** `src/components/ProductSearch.jsx`, `src/components/ProductCard.jsx`
- **Services:** `src/services/productService.js`
- **Hooks:** `src/hooks/useProducts.js`
- **Acceptance Criteria:**
  - Search by product name, SKU, or barcode
  - Auto-complete suggestions
  - Display product image, name, price, stock
  - Keyboard shortcuts for quick navigation
  - Recently sold items quick access
  - Category-based browsing
  - Handle barcode scanner input

**Story CA-004**: POS Cart Management
- **As a** cashier
- **I want to** manage items in the POS cart
- **So that** I can accurately process customer orders
- **Database Models:** `products`, `discounts`, `inventory`
- **Frontend Pages:** `src/pages/cashier/POS.jsx`
- **Components:** `src/components/POSCart.jsx`, `src/components/CartItem.jsx`
- **Services:** `src/services/cartService.js`
- **Hooks:** `src/hooks/useCart.js`
- **Acceptance Criteria:**
  - Add products with quantity adjustment
  - Apply discounts (percentage/fixed amount)
  - Remove items or void entire sale
  - Calculate tax and total in real-time
  - Handle special pricing for staff/bulk
  - Split payments between cash/card
  - Hold/retrieve transactions

**Story CA-005**: Payment Processing
- **As a** cashier
- **I want to** process different payment methods
- **So that** I can complete customer transactions
- **Database Models:** `payments`, `orders`, `order_items`
- **Frontend Pages:** `src/pages/cashier/POS.jsx`
- **Components:** `src/components/PaymentModal.jsx`, `src/components/ReceiptPreview.jsx`
- **Services:** `src/services/paymentService.js`
- **Acceptance Criteria:**
  - Accept cash payments with change calculation
  - Process card payments via Yoco terminal
  - Split payments (cash + card)
  - Generate and print receipts
  - Email receipts to customers
  - Handle payment failures gracefully
  - Void/refund transactions

### Sales Reporting

**Epic: Cashier Reporting**

**Story CA-006**: Daily Sales Report
- **As a** cashier
- **I want to** view my daily sales performance
- **So that** I can track my productivity
- **Database Models:** `orders`, `order_items`, `payments`, `users`
- **Frontend Pages:** `src/pages/cashier/Reports.jsx`
- **Components:** `src/components/SalesChart.jsx`, `src/components/ReportTable.jsx`
- **Services:** `src/services/reportService.js`
- **Utils:** `src/utils/exportUtils.js`
- **Acceptance Criteria:**
  - Sales amount by hour/payment method
  - Number of transactions processed
  - Average transaction value
  - Top selling products
  - Payment method breakdown
  - Export to PDF/Excel
  - Compare with previous days

---

## ⚙️ Admin User Stories

### Dashboard & Analytics

**Epic: Admin Dashboard**

**Story A-001**: Admin Authentication
- **As an** administrator
- **I want to** securely login with enhanced security
- **So that** I can access sensitive business functions
- **Database Models:** `users`, `user_profiles`, `audit_logs`
- **Frontend Pages:** `src/pages/auth/Login.jsx`
- **Components:** `src/components/forms/LoginForm.jsx`, `src/components/TwoFactorAuth.jsx`
- **Services:** `src/services/authService.js`
- **Store:** `src/store/authSlice.js`
- **Acceptance Criteria:**
  - Two-factor authentication required
  - IP address logging and restrictions
  - Failed login attempt notifications
  - Session management with timeout
  - Admin-specific UI theme
  - Activity logging for compliance

**Story A-002**: Executive Dashboard
- **As an** administrator
- **I want to** see key business metrics at a glance
- **So that** I can make informed business decisions
- **Database Models:** `orders`, `products`, `users`, `inventory`, `payments`
- **Frontend Pages:** `src/pages/admin/Dashboard.jsx`
- **Components:** `src/components/MetricCard.jsx`, `src/components/SalesChart.jsx`, `src/components/RecentOrders.jsx`
- **Services:** `src/services/reportService.js`
- **Hooks:** `src/hooks/useAnalytics.js`
- **Acceptance Criteria:**
  - Revenue trends (daily/weekly/monthly)
  - Order volume and conversion rates
  - Top performing products
  - Low stock alerts
  - Customer acquisition metrics
  - Real-time order notifications
  - Customizable dashboard widgets

### Inventory Management

**Epic: Product & Inventory Control**

**Story A-003**: Product Management
- **As an** administrator
- **I want to** manage the product catalog
- **So that** I can maintain accurate product information
- **Database Models:** `products`, `categories`, `product_images`, `inventory`
- **Frontend Pages:** `src/pages/admin/Inventory.jsx`
- **Components:** `src/components/ProductForm.jsx`, `src/components/ImageUpload.jsx`, `src/components/ProductTable.jsx`
- **Services:** `src/services/productService.js`, `src/services/inventoryService.js`
- **Hooks:** `src/hooks/useProducts.js`
- **Acceptance Criteria:**
  - Create/edit/delete products
  - Bulk product import via CSV
  - Image upload with compression
  - SEO optimization fields
  - Product variants management
  - Category assignment
  - Price history tracking
  - Bulk operations (price updates, etc.)

**Story A-004**: Inventory Tracking
- **As an** administrator
- **I want to** monitor stock levels across all products
- **So that** I can prevent stockouts and overstock
- **Database Models:** `inventory`, `inventory_movements`, `products`
- **Frontend Pages:** `src/pages/admin/Inventory.jsx`
- **Components:** `src/components/StockTable.jsx`, `src/components/StockAlerts.jsx`
- **Services:** `src/services/inventoryService.js`
- **Hooks:** `src/hooks/useInventory.js`
- **Acceptance Criteria:**
  - Real-time stock level display
  - Low stock and out-of-stock alerts
  - Stock movement history
  - Automated reorder point calculations
  - Physical stock count functionality
  - Supplier management integration
  - Waste/damage tracking

**Story A-005**: Purchase Orders
- **As an** administrator
- **I want to** generate purchase orders for restocking
- **So that** I can maintain optimal inventory levels
- **Database Models:** `inventory`, `products`, `suppliers` (new), `purchase_orders` (new)
- **Frontend Pages:** `src/pages/admin/PurchaseOrders.jsx`
- **Components:** `src/components/POForm.jsx`, `src/components/SupplierSelect.jsx`
- **Services:** `src/services/purchaseOrderService.js`
- **Acceptance Criteria:**
  - Auto-generate POs based on reorder points
  - Supplier contact management
  - PO approval workflow
  - Track delivery status
  - Update inventory upon receipt
  - Cost analysis and reporting

### Order Management

**Epic: Order Processing**

**Story A-006**: Order Overview
- **As an** administrator
- **I want to** view and manage all customer orders
- **So that** I can ensure timely order fulfillment
- **Database Models:** `orders`, `order_items`, `users`, `addresses`, `payments`
- **Frontend Pages:** `src/pages/admin/Orders.jsx`
- **Components:** `src/components/OrderTable.jsx`, `src/components/OrderFilters.jsx`, `src/components/OrderDetails.jsx`
- **Services:** `src/services/orderService.js`
- **Hooks:** `src/hooks/useOrders.js`
- **Acceptance Criteria:**
  - Filterable order list (status, date, customer)
  - Bulk operations (status updates, exports)
  - Order details modal with full information
  - Customer communication tools
  - Refund/void processing
  - Shipping integration
  - Order analytics and trends

**Story A-007**: Shipping Management
- **As an** administrator
- **I want to** manage order fulfillment and shipping
- **So that** customers receive their orders promptly
- **Database Models:** `orders`, `shipments` (new), `addresses`
- **Frontend Pages:** `src/pages/admin/Orders.jsx`
- **Components:** `src/components/ShippingForm.jsx`, `src/components/LabelPrint.jsx`
- **Services:** `src/services/shippingService.js`
- **Acceptance Criteria:**
  - Generate shipping labels
  - Track shipment status
  - Batch processing for multiple orders
  - Shipping cost calculation
  - Delivery confirmation
  - Customer notification automation
  - Returns processing

### User & Customer Management

**Epic: User Administration**

**Story A-008**: Staff Management
- **As an** administrator
- **I want to** manage staff user accounts
- **So that** I can control system access and permissions
- **Database Models:** `users`, `user_profiles`, `roles` (new), `permissions` (new)
- **Frontend Pages:** `src/pages/admin/Users.jsx`
- **Components:** `src/components/UserForm.jsx`, `src/components/RoleSelector.jsx`
- **Services:** `src/services/userService.js`
- **Acceptance Criteria:**
  - Create/edit staff accounts
  - Role-based permission assignment
  - Account activation/deactivation
  - Password reset functionality
  - Activity monitoring
  - Login history tracking
  - Bulk user operations

**Story A-009**: Customer Management
- **As an** administrator
- **I want to** manage customer accounts and relationships
- **So that** I can provide better customer service
- **Database Models:** `users`, `orders`, `reviews`, `addresses`
- **Frontend Pages:** `src/pages/admin/Customers.jsx`
- **Components:** `src/components/CustomerProfile.jsx`, `src/components/CustomerOrders.jsx`
- **Services:** `src/services/customerService.js`
- **Acceptance Criteria:**
  - Customer profile management
  - Order history and lifetime value
  - Communication history
  - Segmentation for marketing
  - Account merge/delete functionality
  - Export customer data
  - GDPR compliance tools

### Advanced Reporting

**Epic: Business Intelligence**

**Story A-010**: Sales Analytics
- **As an** administrator
- **I want to** analyze sales performance across multiple dimensions
- **So that** I can identify trends and opportunities
- **Database Models:** `orders`, `order_items`, `products`, `categories`, `users`
- **Frontend Pages:** `src/pages/admin/Reports.jsx`
- **Components:** `src/components/AnalyticsCharts.jsx`, `src/components/ReportBuilder.jsx`
- **Services:** `src/services/analyticsService.js`
- **Utils:** `src/utils/chartUtils.js`
- **Acceptance Criteria:**
  - Sales trends by time period
  - Product performance analysis
  - Customer behavior insights
  - Geographic sales distribution
  - Payment method analysis
  - Custom report builder
  - Automated report scheduling

**Story A-011**: Inventory Reports
- **As an** administrator
- **I want to** generate comprehensive inventory reports
- **So that** I can optimize stock management
- **Database Models:** `inventory`, `inventory_movements`, `products`, `orders`
- **Frontend Pages:** `src/pages/admin/Reports.jsx`
- **Components:** `src/components/InventoryCharts.jsx`, `src/components/StockAnalysis.jsx`
- **Services:** `src/services/inventoryService.js`
- **Acceptance Criteria:**
  - Stock turnover analysis
  - Slow-moving inventory reports
  - Cost of goods sold tracking
  - Supplier performance metrics
  - Waste and shrinkage reports
  - Forecasting and demand planning
  - ABC analysis for inventory classification

---

## 🔄 Cross-Role User Stories

### System-Wide Features

**Epic: Universal Functionality**

**Story CR-001**: Real-time Inventory Sync
- **As a** user of any role
- **I want** inventory updates to be reflected immediately across all interfaces
- **So that** stock information is always accurate
- **Database Models:** `inventory`, `products`, `orders`
- **Services:** `src/services/realtimeService.js`
- **Hooks:** `src/hooks/useRealtime.js`
- **Acceptance Criteria:**
  - WebSocket connection for real-time updates
  - Inventory changes broadcast to all connected clients
  - Graceful handling of connection failures
  - Automatic reconnection logic
  - Visual indicators for real-time updates

**Story CR-002**: Search Functionality
- **As a** user of any role
- **I want** to search for relevant information efficiently
- **So that** I can find what I need quickly
- **Database Models:** `products`, `orders`, `users`
- **Components:** `src/components/UniversalSearch.jsx`
- **Services:** `src/services/searchService.js`
- **Hooks:** `src/hooks/useSearch.js`
- **Acceptance Criteria:**
  - Role-appropriate search results
  - Auto-complete suggestions
  - Search history for logged-in users
  - Advanced filters based on user role
  - Keyboard shortcuts for power users

**Story CR-003**: Notification System
- **As a** user of any role
- **I want** to receive relevant notifications
- **So that** I stay informed about important events
- **Database Models:** `notifications` (new), `users`
- **Components:** `src/components/NotificationCenter.jsx`, `src/components/Toast.jsx`
- **Services:** `src/services/notificationService.js`
- **Hooks:** `src/hooks/useNotifications.js`
- **Store:** `src/store/notificationSlice.js`
- **Acceptance Criteria:**
  - Real-time notifications via WebSocket
  - Role-based notification types
  - Email/SMS notification options
  - Notification preferences management
  - Mark as read/unread functionality
  - Notification history

**Story CR-004**: Audit Trail
- **As a** system administrator
- **I want** all user actions to be logged
- **So that** I can maintain security and compliance
- **Database Models:** `audit_logs`, `users`
- **Services:** `src/services/auditService.js`
- **Utils:** `src/utils/auditUtils.js`
- **Acceptance Criteria:**
  - Log all CRUD operations
  - Track user sessions and authentication
  - Record IP addresses and user agents
  - Searchable audit logs
  - Export audit reports
  - Automated compliance reporting

---

## 📋 Implementation Guidelines

### Database Considerations

1. **Performance Optimization:**
   - Implement proper indexing for frequently queried columns
   - Use materialized views for complex reporting queries
   - Consider partitioning for large tables (orders, audit_logs)
   - Implement database connection pooling

2. **Data Integrity:**
   - Enforce foreign key constraints
   - Use database triggers for audit logging
   - Implement soft deletes for critical data
   - Regular backup and recovery procedures

3. **Security:**
   - Row-level security for multi-tenant data
   - Encrypted storage for sensitive data
   - Database user permissions aligned with application roles
   - SQL injection prevention through parameterized queries

### Frontend Architecture

1. **State Management:**
   - Redux Toolkit for global state
   - React Query for server state
   - Local state for component-specific data

2. **Code Organization:**
   - Feature-based folder structure
   - Shared components library
   - Custom hooks for business logic
   - Service layer for API calls

3. **Performance:**
   - Code splitting by route and role
   - Image optimization and lazy loading
   - Memoization for expensive computations
   - Virtual scrolling for large lists

4. **Testing Strategy:**
   - Unit tests for utilities and hooks
   - Integration tests for API services
   - E2E tests for critical user flows
   - Visual regression testing for UI components

This comprehensive documentation provides a solid foundation for implementing the Best Brightness e-commerce platform with clear traceability between user stories, database models, and frontend implementation files.