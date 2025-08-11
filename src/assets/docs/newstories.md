# 🌟 Best Brightness - Enhanced Frontend User Stories & Database Models

## Table of Contents
- [Enhanced Database Schema](#enhanced-database-schema)
- [Customer User Stories](#customer-user-stories)
- [Cashier User Stories](#cashier-user-stories)
- [Admin User Stories](#admin-user-stories)
- [Cross-Role User Stories](#cross-role-user-stories)
- [Implementation Priority](#implementation-priority)

---

## 📊 Enhanced Database Schema

### Enhanced Core Entity Models

#### 1. Users Table (Updated)
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
  loyalty_points: INTEGER DEFAULT 0
  total_spent: DECIMAL(12,2) DEFAULT 0
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 2. Products Table (Enhanced with Barcode)
```sql
products {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  sku: VARCHAR(50) UNIQUE NOT NULL
  barcode: VARCHAR(50) UNIQUE NOT NULL
  name: VARCHAR(255) NOT NULL
  slug: VARCHAR(280) UNIQUE NOT NULL
  description: TEXT
  short_description: TEXT
  category_id: UUID REFERENCES categories(id)
  brand: VARCHAR(100)
  price: DECIMAL(10,2) NOT NULL
  cost_price: DECIMAL(10,2)
  compare_at_price: DECIMAL(10,2)
  current_price: DECIMAL(10,2) GENERATED ALWAYS AS (
    COALESCE(
      (SELECT MIN(discounted_price) FROM active_product_promotions WHERE product_id = id),
      price
    )
  ) STORED
  weight: DECIMAL(8,2)
  dimensions: JSONB
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
  is_combo_eligible: BOOLEAN DEFAULT TRUE
  min_quantity: INTEGER DEFAULT 1
  max_quantity_per_order: INTEGER
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
  created_by: UUID REFERENCES users(id)
}
```

### New Tables for Promotions & Combos

#### 3. Promotions Table
```sql
promotions {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name: VARCHAR(255) NOT NULL
  description: TEXT
  type: promotion_type NOT NULL
  status: promotion_status DEFAULT 'draft'
  priority: INTEGER DEFAULT 0
  discount_type: discount_type NOT NULL
  discount_value: DECIMAL(10,2) NOT NULL
  minimum_quantity: INTEGER DEFAULT 1
  maximum_quantity: INTEGER
  minimum_order_amount: DECIMAL(10,2)
  maximum_discount_amount: DECIMAL(10,2)
  usage_limit: INTEGER
  usage_limit_per_customer: INTEGER DEFAULT 1
  times_used: INTEGER DEFAULT 0
  requires_code: BOOLEAN DEFAULT FALSE
  promo_code: VARCHAR(50) UNIQUE
  stackable: BOOLEAN DEFAULT FALSE
  applies_to_sale_items: BOOLEAN DEFAULT TRUE
  customer_eligibility: JSONB DEFAULT '{}'
  starts_at: TIMESTAMP NOT NULL
  ends_at: TIMESTAMP
  is_featured: BOOLEAN DEFAULT FALSE
  banner_image_url: TEXT
  terms_conditions: TEXT
  created_by: UUID REFERENCES users(id)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 4. Promotion Products Table
```sql
promotion_products {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  promotion_id: UUID REFERENCES promotions(id) ON DELETE CASCADE
  product_id: UUID REFERENCES products(id) ON DELETE CASCADE
  discounted_price: DECIMAL(10,2) NOT NULL
  created_at: TIMESTAMP DEFAULT NOW()
  
  UNIQUE(promotion_id, product_id)
}
```

#### 5. Promotion Categories Table
```sql
promotion_categories {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  promotion_id: UUID REFERENCES promotions(id) ON DELETE CASCADE
  category_id: UUID REFERENCES categories(id) ON DELETE CASCADE
  created_at: TIMESTAMP DEFAULT NOW()
  
  UNIQUE(promotion_id, category_id)
}
```

#### 6. Combos Table
```sql
combos {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name: VARCHAR(255) NOT NULL
  description: TEXT
  combo_type: combo_type NOT NULL DEFAULT 'bundle'
  status: combo_status DEFAULT 'active'
  original_price: DECIMAL(10,2) NOT NULL
  combo_price: DECIMAL(10,2) NOT NULL
  savings_amount: DECIMAL(10,2) GENERATED ALWAYS AS (original_price - combo_price) STORED
  savings_percentage: DECIMAL(5,2) GENERATED ALWAYS AS (
    ROUND(((original_price - combo_price) / original_price * 100), 2)
  ) STORED
  image_url: TEXT
  is_featured: BOOLEAN DEFAULT FALSE
  minimum_quantity: INTEGER DEFAULT 1
  maximum_quantity: INTEGER DEFAULT 10
  usage_limit: INTEGER
  times_purchased: INTEGER DEFAULT 0
  requires_all_items: BOOLEAN DEFAULT TRUE
  starts_at: TIMESTAMP DEFAULT NOW()
  ends_at: TIMESTAMP
  tags: TEXT[]
  created_by: UUID REFERENCES users(id)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 7. Combo Items Table
```sql
combo_items {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  combo_id: UUID REFERENCES combos(id) ON DELETE CASCADE
  product_id: UUID REFERENCES products(id) ON DELETE CASCADE
  quantity: INTEGER NOT NULL DEFAULT 1
  is_required: BOOLEAN DEFAULT TRUE
  can_substitute: BOOLEAN DEFAULT FALSE
  substitute_category_id: UUID REFERENCES categories(id)
  sort_order: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT NOW()
  
  UNIQUE(combo_id, product_id)
}
```

#### 8. Customer Promotions Usage Table
```sql
customer_promotions_usage {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  customer_id: UUID REFERENCES users(id) ON DELETE CASCADE
  promotion_id: UUID REFERENCES promotions(id) ON DELETE CASCADE
  order_id: UUID REFERENCES orders(id)
  usage_count: INTEGER DEFAULT 1
  discount_applied: DECIMAL(10,2) NOT NULL
  used_at: TIMESTAMP DEFAULT NOW()
}
```

#### 9. Enhanced Orders Table
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
  promotion_discount: DECIMAL(10,2) DEFAULT 0
  combo_discount: DECIMAL(10,2) DEFAULT 0
  loyalty_points_used: INTEGER DEFAULT 0
  loyalty_discount: DECIMAL(10,2) DEFAULT 0
  total_amount: DECIMAL(10,2) NOT NULL
  notes: TEXT
  tags: TEXT[]
  applied_promotions: JSONB DEFAULT '[]'
  applied_combos: JSONB DEFAULT '[]'
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
  shipped_at: TIMESTAMP
  delivered_at: TIMESTAMP
  cancelled_at: TIMESTAMP
  cancellation_reason: TEXT
  processed_by: UUID REFERENCES users(id)
}
```

#### 10. Enhanced Order Items Table
```sql
order_items {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  order_id: UUID REFERENCES orders(id) ON DELETE CASCADE
  product_id: UUID REFERENCES products(id)
  combo_id: UUID REFERENCES combos(id)
  item_type: order_item_type NOT NULL DEFAULT 'product'
  product_name: VARCHAR(255) NOT NULL
  product_sku: VARCHAR(50) NOT NULL
  quantity: INTEGER NOT NULL
  unit_price: DECIMAL(10,2) NOT NULL
  original_unit_price: DECIMAL(10,2) NOT NULL
  discount_per_unit: DECIMAL(10,2) DEFAULT 0
  total_price: DECIMAL(10,2) NOT NULL
  tax_rate: DECIMAL(5,4) DEFAULT 0
  tax_amount: DECIMAL(10,2) DEFAULT 0
  promotion_id: UUID REFERENCES promotions(id)
  promotion_discount: DECIMAL(10,2) DEFAULT 0
  product_snapshot: JSONB
  combo_snapshot: JSONB
  created_at: TIMESTAMP DEFAULT NOW()
}
```

### New Enums and Types

```sql
-- Promotion type enum
CREATE TYPE promotion_type AS ENUM (
  'percentage_off', 'fixed_amount_off', 'buy_x_get_y', 
  'bulk_discount', 'flash_sale', 'clearance', 'seasonal'
);

-- Promotion status enum  
CREATE TYPE promotion_status AS ENUM ('draft', 'scheduled', 'active', 'paused', 'expired', 'cancelled');

-- Combo type enum
CREATE TYPE combo_type AS ENUM ('bundle', 'mix_match', 'tiered', 'bogo');

-- Combo status enum
CREATE TYPE combo_status AS ENUM ('draft', 'active', 'inactive', 'expired');

-- Order item type enum
CREATE TYPE order_item_type AS ENUM ('product', 'combo', 'combo_item');

-- Enhanced discount type enum
CREATE TYPE discount_type AS ENUM (
  'percentage', 'fixed_amount', 'free_shipping', 
  'buy_x_get_y_free', 'buy_x_get_y_percent_off'
);
```

### Views for Active Promotions

```sql
-- View for active product promotions
CREATE VIEW active_product_promotions AS
SELECT 
  pp.promotion_id,
  pp.product_id,
  pp.discounted_price,
  p.name as promotion_name,
  p.type as promotion_type,
  p.starts_at,
  p.ends_at,
  p.priority
FROM promotion_products pp
JOIN promotions p ON pp.promotion_id = p.id
WHERE p.status = 'active'
  AND p.starts_at <= NOW()
  AND (p.ends_at IS NULL OR p.ends_at > NOW());

-- View for active combos
CREATE VIEW active_combos AS
SELECT *
FROM combos
WHERE status = 'active'
  AND starts_at <= NOW()
  AND (ends_at IS NULL OR ends_at > NOW());

-- View for featured promotions
CREATE VIEW featured_promotions AS
SELECT *
FROM promotions
WHERE status = 'active'
  AND is_featured = true
  AND starts_at <= NOW()
  AND (ends_at IS NULL OR ends_at > NOW());
```

### Enhanced Indexes

```sql
-- Promotion indexes
CREATE INDEX idx_promotions_status_dates ON promotions(status, starts_at, ends_at);
CREATE INDEX idx_promotions_code ON promotions(promo_code) WHERE promo_code IS NOT NULL;
CREATE INDEX idx_promotion_products_product ON promotion_products(product_id);
CREATE INDEX idx_promotion_categories_category ON promotion_categories(category_id);

-- Combo indexes
CREATE INDEX idx_combos_status_dates ON combos(status, starts_at, ends_at);
CREATE INDEX idx_combo_items_combo ON combo_items(combo_id);
CREATE INDEX idx_combo_items_product ON combo_items(product_id);

-- Enhanced product indexes
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_current_price ON products(current_price);
CREATE INDEX idx_products_combo_eligible ON products(is_combo_eligible);
```

---

## 👥 Customer User Stories

### Enhanced Authentication & Account Management

**Story C-001**: Account Registration (Enhanced)
- **As a** potential customer
- **I want to** create a new account with email verification and automatic loyalty enrollment
- **So that** I can access personalized features, make purchases, and earn loyalty points
- **Implementation Files:**
  - **Page:** `src/pages/auth/Register.jsx`
  - **Components:** `src/components/forms/RegisterForm.jsx`, `src/components/LoyaltyWelcome.jsx`
  - **Services:** `src/services/authService.js`, `src/services/loyaltyService.js`
  - **Store:** `src/store/authSlice.js`, `src/store/loyaltySlice.js`
  - **Database:** `users`, `user_profiles`, `loyalty_transactions`

### Enhanced Product Discovery & Browsing

**Story C-005**: Enhanced Homepage Experience
- **As a** visitor
- **I want to** see an engaging homepage with featured products, active promotions, and combo deals
- **So that** I can quickly discover popular items and current offers
- **Implementation Files:**
  - **Page:** `src/pages/customer/Home.jsx`
  - **Components:** 
    - `src/components/FeaturedProducts.jsx`
    - `src/components/ProductCarousel.jsx`
    - `src/components/PromotionBanner.jsx`
    - `src/components/FeaturedCombos.jsx`
    - `src/components/FlashSaleCounter.jsx`
  - **Services:** `src/services/productService.js`, `src/services/promotionService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/usePromotions.js`
  - **Database:** `products`, `categories`, `promotions`, `combos`, `featured_promotions`

**Story C-006**: Enhanced Product Search with Promotions
- **As a** customer
- **I want to** search for products and see promotional prices prominently
- **So that** I can find deals and make informed purchasing decisions
- **Implementation Files:**
  - **Page:** `src/pages/customer/Products.jsx`
  - **Components:** 
    - `src/components/forms/SearchBox.jsx`
    - `src/components/SearchResults.jsx`
    - `src/components/ProductCard.jsx` (enhanced with promotion badges)
    - `src/components/PromotionBadge.jsx`
    - `src/components/PriceDisplay.jsx`
  - **Services:** `src/services/productService.js`, `src/services/promotionService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/usePromotions.js`
  - **Store:** `src/store/productSlice.js`, `src/store/promotionSlice.js`
  - **Database:** `products`, `categories`, `active_product_promotions`

**Story C-008**: Enhanced Product Details with Barcode & Promotions
- **As a** customer
- **I want to** view detailed product information including current promotions and combo opportunities
- **So that** I can make informed purchasing decisions and maximize savings
- **Implementation Files:**
  - **Page:** `src/pages/customer/ProductDetails.jsx`
  - **Components:** 
    - `src/components/ProductGallery.jsx`
    - `src/components/ProductInfo.jsx`
    - `src/components/ProductReviews.jsx`
    - `src/components/RelatedProducts.jsx`
    - `src/components/AddToCartButton.jsx`
    - `src/components/PriceBreakdown.jsx`
    - `src/components/PromotionDetails.jsx`
    - `src/components/ComboSuggestions.jsx`
    - `src/components/ProductBarcode.jsx`
  - **Services:** `src/services/productService.js`, `src/services/promotionService.js`, `src/services/comboService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/usePromotions.js`, `src/hooks/useCombos.js`
  - **Store:** `src/store/productSlice.js`, `src/store/promotionSlice.js`, `src/store/comboSlice.js`
  - **Database:** `products`, `product_images`, `reviews`, `inventory`, `active_product_promotions`, `combos`

### New Promotion & Combo Stories

**Story C-013**: Browse Active Promotions
- **As a** customer
- **I want to** view all current promotions and sales
- **So that** I can find the best deals available
- **Implementation Files:**
  - **Page:** `src/pages/customer/Promotions.jsx`
  - **Components:** 
    - `src/components/PromotionGrid.jsx`
    - `src/components/PromotionCard.jsx`
    - `src/components/PromotionFilter.jsx`
    - `src/components/CountdownTimer.jsx`
    - `src/components/PromotionDetails.jsx`
  - **Services:** `src/services/promotionService.js`
  - **Hooks:** `src/hooks/usePromotions.js`
  - **Store:** `src/store/promotionSlice.js`
  - **Database:** `promotions`, `promotion_products`, `promotion_categories`, `featured_promotions`

**Story C-014**: Browse Combo Deals
- **As a** customer
- **I want to** view available combo deals and bundles
- **So that** I can save money by purchasing related items together
- **Implementation Files:**
  - **Page:** `src/pages/customer/Combos.jsx`
  - **Components:** 
    - `src/components/ComboGrid.jsx`
    - `src/components/ComboCard.jsx`
    - `src/components/ComboBuilder.jsx`
    - `src/components/SavingsCalculator.jsx`
    - `src/components/ComboPreview.jsx`
  - **Services:** `src/services/comboService.js`
  - **Hooks:** `src/hooks/useCombos.js`
  - **Store:** `src/store/comboSlice.js`
  - **Database:** `combos`, `combo_items`, `products`, `active_combos`

**Story C-015**: Add Combo to Cart
- **As a** customer
- **I want to** add combo deals to my shopping cart
- **So that** I can purchase bundled items at discounted prices
- **Implementation Files:**
  - **Components:** 
    - `src/components/AddComboToCart.jsx`
    - `src/components/ComboCustomizer.jsx`
    - `src/components/ComboValidation.jsx`
  - **Services:** `src/services/cartService.js`, `src/services/comboService.js`
  - **Hooks:** `src/hooks/useCart.js`, `src/hooks/useCombos.js`
  - **Store:** `src/store/cartSlice.js`
  - **Database:** `shopping_carts`, `cart_items`, `combos`, `combo_items`

### Enhanced Shopping Cart & Checkout

**Story C-010**: Enhanced Shopping Cart with Promotions
- **As a** customer
- **I want to** view my cart with applied promotions and suggested combos
- **So that** I can see my savings and optimize my purchase
- **Implementation Files:**
  - **Page:** `src/pages/customer/Cart.jsx`
  - **Components:** 
    - `src/components/CartItem.jsx`
    - `src/components/CartSummary.jsx`
    - `src/components/PromotionCodeForm.jsx`
    - `src/components/AutoAppliedPromotions.jsx`
    - `src/components/ComboRecommendations.jsx`
    - `src/components/LoyaltyPointsBalance.jsx`
  - **Services:** `src/services/cartService.js`, `src/services/promotionService.js`
  - **Hooks:** `src/hooks/useCart.js`, `src/hooks/usePromotions.js`
  - **Store:** `src/store/cartSlice.js`, `src/store/promotionSlice.js`
  - **Database:** `shopping_carts`, `cart_items`, `products`, `promotions`, `combos`

**Story C-011**: Enhanced Checkout with Loyalty Points
- **As a** customer
- **I want to** complete my purchase with promotional discounts and loyalty point redemption
- **So that** I can maximize my savings
- **Implementation Files:**
  - **Page:** `src/pages/customer/Checkout.jsx`
  - **Components:** 
    - `src/components/forms/CheckoutForm.jsx`
    - `src/components/forms/AddressForm.jsx`
    - `src/components/PaymentForm.jsx`
    - `src/components/OrderSummary.jsx`
    - `src/components/CheckoutSteps.jsx`
    - `src/components/LoyaltyPointsRedemption.jsx`
    - `src/components/FinalPriceBreakdown.jsx`
  - **Services:** `src/services/orderService.js`, `src/services/paymentService.js`, `src/services/loyaltyService.js`
  - **Hooks:** `src/hooks/useOrders.js`, `src/hooks/useLoyalty.js`
  - **Store:** `src/store/orderSlice.js`, `src/store/loyaltySlice.js`
  - **Database:** `orders`, `order_items`, `addresses`, `payments`, `promotions`, `combos`, `customer_promotions_usage`

---

## 💰 Cashier User Stories

### Enhanced POS Operations

**Story CA-003**: Enhanced Product Search with Barcode Scanning
- **As a** cashier
- **I want to** quickly find products using barcode scanning or search
- **So that** I can efficiently process customer purchases with accurate pricing
- **Implementation Files:**
  - **Page:** `src/pages/cashier/POS.jsx`
  - **Components:** 
    - `src/components/forms/SearchBox.jsx`
    - `src/components/ProductSearch.jsx`
    - `src/components/BarcodeScanner.jsx`
    - `src/components/CategoryBrowser.jsx`
    - `src/components/ProductInfo.jsx`
    - `src/components/PromotionAlert.jsx`
  - **Services:** `src/services/productService.js`, `src/services/barcodeService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/useBarcode.js`
  - **Store:** `src/store/productSlice.js`
  - **Database:** `products`, `inventory`, `categories`, `active_product_promotions`

**Story CA-004**: Enhanced POS Cart with Automatic Promotions
- **As a** cashier
- **I want to** manage items in the POS cart with automatic promotion application
- **So that** customers receive applicable discounts without manual intervention
- **Implementation Files:**
  - **Page:** `src/pages/cashier/POS.jsx`
  - **Components:** 
    - `src/components/POSCart.jsx`
    - `src/components/CartItem.jsx`
    - `src/components/AutoPromotionDisplay.jsx`
    - `src/components/ManualDiscountSelector.jsx`
    - `src/components/ComboDetection.jsx`
    - `src/components/TaxCalculator.jsx`
  - **Services:** `src/services/cartService.js`, `src/services/promotionService.js`
  - **Hooks:** `src/hooks/useCart.js`, `src/hooks/usePromotions.js`
  - **Store:** `src/store/cartSlice.js`, `src/store/promotionSlice.js`
  - **Database:** `products`, `promotions`, `combos`, `inventory`

### New Promotion Management Stories

**Story CA-007**: Apply Manual Promotions
- **As a** cashier
- **I want to** manually apply or remove promotions during checkout
- **So that** I can handle special cases and customer requests
- **Implementation Files:**
  - **Page:** `src/pages/cashier/POS.jsx`
  - **Components:** 
    - `src/components/ManualPromotionSelector.jsx`
    - `src/components/PromotionOverride.jsx`
    - `src/components/ManagerApprovalModal.jsx`
  - **Services:** `src/services/promotionService.js`
  - **Hooks:** `src/hooks/usePromotions.js`
  - **Database:** `promotions`, `orders`, `audit_logs`

**Story CA-008**: Combo Deal Processing
- **As a** cashier
- **I want to** identify and process combo deals at the POS
- **So that** customers receive bundle discounts automatically
- **Implementation Files:**
  - **Page:** `src/pages/cashier/POS.jsx`
  - **Components:** 
    - `src/components/ComboDetector.jsx`
    - `src/components/ComboConfirmation.jsx`
    - `src/components/ComboBreakdown.jsx`
  - **Services:** `src/services/comboService.js`
  - **Hooks:** `src/hooks/useCombos.js`
  - **Database:** `combos`, `combo_items`, `products`

---

## ⚙️ Admin User Stories

### Enhanced Inventory Management

**Story A-003**: Enhanced Product Management with Barcodes
- **As an** administrator
- **I want to** manage the product catalog including barcode generation and promotion pricing
- **So that** I can maintain accurate product information and pricing strategies
- **Implementation Files:**
  - **Page:** `src/pages/admin/Inventory.jsx`
  - **Components:** 
    - `src/components/ProductForm.jsx`
    - `src/components/ProductTable.jsx`
    - `src/components/ImageUpload.jsx`
    - `src/components/CategorySelector.jsx`
    - `src/components/BarcodeGenerator.jsx`
    - `src/components/BulkImport.jsx`
    - `src/components/PricingHistory.jsx`
  - **Services:** `src/services/productService.js`, `src/services/inventoryService.js`, `src/services/barcodeService.js`
  - **Hooks:** `src/hooks/useProducts.js`, `src/hooks/useInventory.js`
  - **Store:** `src/store/productSlice.js`, `src/store/inventorySlice.js`
  - **Utils:** `src/utils/imageUtils.js`, `src/utils/barcodeUtils.js`
  - **Database:** `products`, `categories`, `product_images`, `inventory`

### New Promotion Management Stories

**Story A-012**: Create and Manage Promotions
- **As an** administrator
- **I want to** create, schedule, and manage promotional campaigns
- **So that** I can drive sales and manage inventory effectively
- **Implementation Files:**
  - **Page:** `src/pages/admin/Promotions.jsx`
  - **Components:** 
    - `src/components/PromotionForm.jsx`
    - `src/components/PromotionTable.jsx`
    - `src/components/PromotionScheduler.jsx`
    - `src/components/ProductSelector.jsx`
    - `src/components/CategorySelector.jsx`
    - `src/components/PromotionPreview.jsx`
    - `src/components/PromotionAnalytics.jsx`
  - **Services:** `src/services/promotionService.js`
  - **Hooks:** `src/hooks/usePromotions.js`
  - **Store:** `src/store/promotionSlice.js`
  - **Database:** `promotions`, `promotion_products`, `promotion_categories`, `customer_promotions_usage`

**Story A-013**: Combo Deal Management
- **As an** administrator
- **I want to** create and manage combo deals and bundles
- **So that** I can increase average order value and move inventory
- **Implementation Files:**
  - **Page:** `src/pages/admin/Combos.jsx`
  - **Components:** 
    - `src/components/ComboForm.jsx`
    - `src/components/ComboTable.jsx`
    - `src/components/ComboBuilder.jsx`
    - `src/components/ComboItemSelector.jsx`
    - `src/components/ProfitabilityCalculator.jsx`
    - `src/components/ComboPerformance.jsx`
  - **Services:** `src/services/comboService.js`
  - **Hooks:** `src/hooks/useCombos.js`
  - **Store:** `src/store/comboSlice.js`
  - **Database:** `combos`, `combo_items`, `products`

**Story A-014**: Flash Sales Management
- **As an** administrator
- **I want to** create and manage time-limited flash sales
- **So that** I can create urgency and boost short-term sales
- **Implementation Files:**
  - **Page:** `src/pages/admin/FlashSales.jsx`
  - **Components:** 
    - `src/components/FlashSaleForm.jsx`
    - `src/components/FlashSaleTimer.jsx`
    - `src/components/InventoryImpactAnalysis.jsx`
    - `src/components/FlashSaleNotifications.jsx`
  - **Services:** `src/services/flashSaleService.js`
  - **Hooks:** `src/hooks/useFlashSales.js`
  - **Database:** `promotions`, `products`, `inventory`

### Enhanced Analytics & Reporting

**Story A-015**: Promotion Performance Analytics
- **As an** administrator
- **I want to** analyze the performance of promotions and combos
- **So that** I can optimize future campaigns and pricing strategies
- **Implementation Files:**
  - **Page:** `src/pages/admin/PromotionAnalytics.jsx`
  - **Components:** 
    - `src/components/PromotionMetrics.jsx`
    - `src/components/ROICalculator.jsx`
    - `src/components/CustomerSegmentAnalysis.jsx`
    - `src/components/PromotionComparison.jsx`
    - `src/components/RecommendationEngine.jsx`
  - **Services:** `src/services/analyticsService.js`
  - **Hooks:** `src/hooks/useAnalytics.js`
  - **Utils:** `src/utils/analyticsUtils.js`
  - **Database:** `orders`, `order_items`, `promotions`, `combos`, `customer_promotions_usage`

**Story A-016**: Barcode Management System
- **As an** administrator
- **I want to** manage product barcodes and generate new ones
- **So that** I can ensure efficient POS operations and inventory tracking
- **Implementation Files:**
  - **Page:** `src/pages/admin/Barcodes.jsx`
  - **Components:** 
    - `src/components/BarcodeGenerator.jsx`
    - `src/components/BarcodeScanner.jsx`
    - `src/components/BarcodePrinter.jsx`
    - `src/components/BarcodeValidator.jsx`
    - `src/components/BulkBarcodeGenerator.jsx`
  - **Services:** `src/services/barcodeService.js`
  - **Hooks:** `src/hooks/useBarcode.js`
  - **Utils:** `src/utils/barcodeUtils.js`
  - **Database:** `products`, `inventory`

**Story A-017**: Customer Loyalty Program Management
- **As an** administrator
- **I want to** manage customer loyalty programs and point systems
- **So that** I can increase customer retention and lifetime value
- **Implementation Files:**
  - **Page:** `src/pages/admin/LoyaltyProgram.jsx`
  - **Components:** 
    - `src/components/LoyaltySettings.jsx`
    - `src/components/PointsRuleEngine.jsx`
    - `src/components/LoyaltyTiers.jsx`
    - `src/components/CustomerLoyaltyStats.jsx`
    - `src/components/PointsAdjustment.jsx`
  - **Services:** `src/services/loyaltyService.js`
  - **Hooks:** `src/hooks/useLoyalty.js`
  - **Store:** `src/store/loyaltySlice.js`
  - **Database:** `users`, `loyalty_transactions`, `loyalty_tiers`, `loyalty_rules`

### New Database Tables for Enhanced Features

#### 11. Loyalty Transactions Table
```sql
loyalty_transactions {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  customer_id: UUID REFERENCES users(id) ON DELETE CASCADE
  transaction_type: loyalty_transaction_type NOT NULL
  points: INTEGER NOT NULL
  balance_after: INTEGER NOT NULL
  order_id: UUID REFERENCES orders(id)
  promotion_id: UUID REFERENCES promotions(id)
  description: VARCHAR(255)
  expires_at: TIMESTAMP
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 12. Loyalty Tiers Table
```sql
loyalty_tiers {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name: VARCHAR(100) NOT NULL
  minimum_points: INTEGER NOT NULL
  minimum_spent: DECIMAL(10,2) NOT NULL
  benefits: JSONB DEFAULT '{}'
  discount_percentage: DECIMAL(5,2) DEFAULT 0
  free_shipping: BOOLEAN DEFAULT FALSE
  early_access: BOOLEAN DEFAULT FALSE
  birthday_bonus: INTEGER DEFAULT 0
  is_active: BOOLEAN DEFAULT TRUE
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 13. Loyalty Rules Table
```sql
loyalty_rules {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name: VARCHAR(100) NOT NULL
  rule_type: loyalty_rule_type NOT NULL
  points_per_action: INTEGER NOT NULL
  minimum_order_amount: DECIMAL(10,2)
  applicable_categories: UUID[]
  applicable_products: UUID[]
  multiplier: DECIMAL(3,2) DEFAULT 1.0
  is_active: BOOLEAN DEFAULT TRUE
  starts_at: TIMESTAMP DEFAULT NOW()
  ends_at: TIMESTAMP
  created_at: TIMESTAMP DEFAULT NOW()
}
```

#### 14. Flash Sales Table
```sql
flash_sales {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  name: VARCHAR(255) NOT NULL
  description: TEXT
  banner_image_url: TEXT
  starts_at: TIMESTAMP NOT NULL
  ends_at: TIMESTAMP NOT NULL
  max_quantity_per_customer: INTEGER DEFAULT 1
  total_quantity_limit: INTEGER
  quantity_sold: INTEGER DEFAULT 0
  notification_sent: BOOLEAN DEFAULT FALSE
  status: flash_sale_status DEFAULT 'scheduled'
  created_by: UUID REFERENCES users(id)
  created_at: TIMESTAMP DEFAULT NOW()
  updated_at: TIMESTAMP DEFAULT NOW()
}
```

#### 15. Flash Sale Items Table
```sql
flash_sale_items {
  id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
  flash_sale_id: UUID REFERENCES flash_sales(id) ON DELETE CASCADE
  product_id: UUID REFERENCES products(id) ON DELETE CASCADE
  original_price: DECIMAL(10,2) NOT NULL
  flash_price: DECIMAL(10,2) NOT NULL
  quantity_limit: INTEGER
  quantity_sold: INTEGER DEFAULT 0
  created_at: TIMESTAMP DEFAULT NOW()
  
  UNIQUE(flash_sale_id, product_id)
}
```

### Additional Enums

```sql
-- Loyalty transaction type enum
CREATE TYPE loyalty_transaction_type AS ENUM (
  'earned_purchase', 'earned_bonus', 'redeemed', 'expired', 
  'adjusted', 'birthday_bonus', 'referral_bonus'
);

-- Loyalty rule type enum
CREATE TYPE loyalty_rule_type AS ENUM (
  'purchase_amount', 'product_purchase', 'category_purchase',
  'first_purchase', 'birthday', 'referral', 'review'
);

-- Flash sale status enum
CREATE TYPE flash_sale_status AS ENUM ('draft', 'scheduled', 'active', 'ended', 'cancelled');
```

---

## 🔄 Cross-Role User Stories

### Enhanced System-Wide Features

**Story CR-001**: Enhanced Real-time Inventory Sync with Promotions
- **As a** user of any role
- **I want** inventory updates and promotional pricing to be reflected immediately across all interfaces
- **So that** stock information and pricing is always accurate
- **Implementation Files:**
  - **Services:** `src/services/realtimeService.js`
  - **Hooks:** `src/hooks/useRealtime.js`
  - **Store:** `src/store/inventorySlice.js`, `src/store/promotionSlice.js`
  - **Components:** Real-time updates in all inventory and pricing components
  - **Database:** `inventory`, `products`, `promotions`, `active_product_promotions`

**Story CR-005**: Promotion Notification System
- **As a** user of any role
- **I want** to receive notifications about relevant promotions and flash sales
- **So that** I stay informed about current offers and time-sensitive deals
- **Implementation Files:**
  - **Components:** 
    - `src/components/PromotionNotifications.jsx`
    - `src/components/FlashSaleAlert.jsx`
    - `src/components/NotificationCenter.jsx`
  - **Services:** `src/services/notificationService.js`
  - **Hooks:** `src/hooks/useNotifications.js`
  - **Store:** `src/store/notificationSlice.js`
  - **Database:** `notifications`, `promotions`, `flash_sales`, `users`

**Story CR-006**: Barcode Integration Across Roles
- **As a** user of any role
- **I want** consistent barcode functionality across customer, cashier, and admin interfaces
- **So that** product identification is seamless throughout the system
- **Implementation Files:**
  - **Components:** 
    - `src/components/BarcodeScanner.jsx`
    - `src/components/BarcodeDisplay.jsx`
    - `src/components/BarcodeGenerator.jsx`
  - **Services:** `src/services/barcodeService.js`
  - **Hooks:** `src/hooks/useBarcode.js`
  - **Utils:** `src/utils/barcodeUtils.js`
  - **Database:** `products`, `inventory`

### New Cross-Role Stories

**Story CR-007**: Dynamic Pricing Display
- **As a** user viewing products
- **I want** to see current pricing with promotional discounts clearly indicated
- **So that** I understand the actual price and savings
- **Implementation Files:**
  - **Components:** 
    - `src/components/PriceDisplay.jsx`
    - `src/components/PromotionBadge.jsx`
    - `src/components/SavingsIndicator.jsx`
    - `src/components/PriceHistory.jsx`
  - **Services:** `src/services/pricingService.js`
  - **Hooks:** `src/hooks/usePricing.js`
  - **Database:** `products`, `promotions`, `active_product_promotions`

**Story CR-008**: Universal Search with Promotions
- **As a** user of any role
- **I want** to search for products, promotions, and combos efficiently
- **So that** I can find relevant information including current offers
- **Implementation Files:**
  - **Components:** 
    - `src/components/forms/SearchBox.jsx`
    - `src/components/UniversalSearch.jsx`
    - `src/components/SearchResults.jsx`
    - `src/components/PromotionSearchResults.jsx`
    - `src/components/ComboSearchResults.jsx`
  - **Services:** `src/services/searchService.js`
  - **Hooks:** `src/hooks/useSearch.js`
  - **Database:** `products`, `promotions`, `combos`, `categories`

---

## 📁 Enhanced File Structure

### New Components and Pages

```
src/
├── components/
│   ├── promotions/
│   │   ├── PromotionBanner.jsx
│   │   ├── PromotionCard.jsx
│   │   ├── PromotionGrid.jsx
│   │   ├── PromotionBadge.jsx
│   │   ├── PromotionDetails.jsx
│   │   ├── CountdownTimer.jsx
│   │   ├── FlashSaleAlert.jsx
│   │   └── PromotionNotifications.jsx
│   │
│   ├── combos/
│   │   ├── ComboCard.jsx
│   │   ├── ComboGrid.jsx
│   │   ├── ComboBuilder.jsx
│   │   ├── ComboPreview.jsx
│   │   ├── ComboSuggestions.jsx
│   │   ├── SavingsCalculator.jsx
│   │   └── AddComboToCart.jsx
│   │
│   ├── pricing/
│   │   ├── PriceDisplay.jsx
│   │   ├── PriceBreakdown.jsx
│   │   ├── SavingsIndicator.jsx
│   │   ├── PriceHistory.jsx
│   │   └── DynamicPricing.jsx
│   │
│   ├── barcode/
│   │   ├── BarcodeScanner.jsx
│   │   ├── BarcodeDisplay.jsx
│   │   ├── BarcodeGenerator.jsx
│   │   ├── BarcodePrinter.jsx
│   │   └── BarcodeValidator.jsx
│   │
│   ├── loyalty/
│   │   ├── LoyaltyPointsBalance.jsx
│   │   ├── LoyaltyPointsRedemption.jsx
│   │   ├── LoyaltyTierDisplay.jsx
│   │   ├── PointsHistory.jsx
│   │   └── LoyaltyWelcome.jsx
│   │
│   └── analytics/
│       ├── PromotionMetrics.jsx
│       ├── ComboPerformance.jsx
│       ├── ROICalculator.jsx
│       ├── CustomerSegmentAnalysis.jsx
│       └── RecommendationEngine.jsx
│
├── pages/
│   ├── customer/
│   │   ├── Promotions.jsx
│   │   ├── Combos.jsx
│   │   ├── FlashSales.jsx
│   │   └── LoyaltyProgram.jsx
│   │
│   ├── admin/
│   │   ├── Promotions.jsx
│   │   ├── Combos.jsx
│   │   ├── FlashSales.jsx
│   │   ├── Barcodes.jsx
│   │   ├── LoyaltyProgram.jsx
│   │   └── PromotionAnalytics.jsx
│   │
│   └── cashier/
│       └── PromotionManagement.jsx
│
├── hooks/
│   ├── usePromotions.js
│   ├── useCombos.js
│   ├── useBarcode.js
│   ├── useLoyalty.js
│   ├── useFlashSales.js
│   ├── usePricing.js
│   └── useAnalytics.js
│
├── services/
│   ├── promotionService.js
│   ├── comboService.js
│   ├── barcodeService.js
│   ├── loyaltyService.js
│   ├── flashSaleService.js
│   ├── pricingService.js
│   └── analyticsService.js
│
├── store/
│   ├── promotionSlice.js
│   ├── comboSlice.js
│   ├── loyaltySlice.js
│   ├── flashSaleSlice.js
│   └── notificationSlice.js
│
└── utils/
    ├── barcodeUtils.js
    ├── promotionUtils.js
    ├── comboUtils.js
    ├── loyaltyUtils.js
    ├── pricingUtils.js
    └── analyticsUtils.js
```

---

## 📋 Implementation Priority

### Phase 1 (MVP - Customer & Basic Admin)
1. **Enhanced Authentication System** with loyalty enrollment (C-001, C-002, C-003)
2. **Enhanced Product Catalog** with barcode support (C-005, C-006, C-007, C-008)
3. **Basic Promotion System** (C-013, A-012)
4. **Enhanced Shopping Cart** with promotion application (C-009, C-010)
5. **Enhanced Checkout** with loyalty points (C-011)
6. **Order History** with promotion tracking (C-012)
7. **Admin Dashboard** with promotion metrics (A-001, A-002)
8. **Enhanced Product Management** with barcode generation (A-003, A-016)

### Phase 2 (Enhanced Features & Cashier)
1. **Enhanced POS System** with barcode scanning (CA-001, CA-002, CA-003, CA-004, CA-005)
2. **Manual Promotion Management** for cashiers (CA-007)
3. **Combo Deal System** (C-014, C-015, A-013, CA-008)
4. **Flash Sales System** (A-014)
5. **Enhanced Inventory Management** with promotion integration (A-004, A-005)
6. **Enhanced Order Management** with promotion tracking (A-006, A-007)
7. **Basic Reporting** with promotion analytics (CA-006, A-010, A-015)

### Phase 3 (Advanced Features & Analytics)
1. **Full Loyalty Program** (A-017, loyalty components)
2. **Advanced User Management** (A-008, A-009)
3. **Advanced Analytics** with promotion ROI (A-011, advanced analytics)
4. **Real-time Features** with promotion sync (CR-001, CR-005, CR-006)
5. **Advanced Search** with promotion integration (CR-008)
6. **Audit & Compliance** for promotions (CR-004)

### Phase 4 (Optimization & Advanced Analytics)
1. **AI-Powered Recommendation Engine**
2. **Advanced Customer Segmentation**
3. **Predictive Analytics for Promotions**
4. **Advanced Loyalty Tier Management**
5. **Automated Promotion Optimization**

---

## 🎯 Key Features Summary

### 🏷️ Promotion System Features
- **Flexible Promotion Types**: Percentage off, fixed amount, BOGO, bulk discounts
- **Automated Application**: Smart promotion detection and application
- **Scheduling**: Start/end dates with automatic activation
- **Customer Targeting**: Segment-specific promotions
- **Usage Limits**: Per customer and global limits
- **Stackable Promotions**: Allow multiple promotions when configured
- **Flash Sales**: Time-limited deals with countdown timers

### 🎁 Combo Deal Features
- **Bundle Types**: Fixed bundles, mix-and-match, tiered pricing
- **Flexible Configuration**: Required vs. optional items
- **Substitution Options**: Allow product substitutions within categories
- **Dynamic Pricing**: Real-time savings calculation
- **Smart Suggestions**: AI-powered combo recommendations
- **Performance Tracking**: ROI analysis for combo deals

### 🏪 Barcode System Features
- **Universal Barcode Support**: EAN-13, UPC-A, Code 128
- **Barcode Generation**: Automatic generation for new products
- **POS Integration**: Seamless barcode scanning at checkout
- **Bulk Operations**: Generate/print multiple barcodes
- **Validation**: Ensure barcode uniqueness and format compliance

### 🎖️ Loyalty Program Features
- **Points System**: Earn points on purchases and actions
- **Tier Management**: Multiple loyalty tiers with benefits
- **Flexible Redemption**: Points for discounts or free products
- **Bonus Campaigns**: Special point multipliers and bonuses
- **Comprehensive Tracking**: Full transaction history

### 📊 Analytics & Reporting Features
- **Promotion Performance**: ROI, usage rates, customer segments
- **Combo Analysis**: Best performing bundles, profit margins
- **Customer Insights**: Buying patterns, loyalty analysis
- **Inventory Impact**: Promotion effects on stock movement
- **Real-time Dashboards**: Live metrics and KPIs

This enhanced system provides a comprehensive e-commerce platform with advanced promotional capabilities, barcode integration, combo deals, and loyalty programs, ensuring maximum flexibility for business operations while providing excellent customer experience.