# 🗄️ Best Brightness - Supabase Database Schema & Migration Guide

## Table of Contents
- [Database Overview](#database-overview)
- [Migration Strategy](#migration-strategy)
- [Schema Creation Scripts](#schema-creation-scripts)
- [Row Level Security (RLS) Policies](#row-level-security-rls-policies)
- [Database Functions](#database-functions)
- [Triggers and Automation](#triggers-and-automation)
- [Indexes and Performance](#indexes-and-performance)
- [Seed Data](#seed-data)
- [Migration Commands](#migration-commands)
- [Best Practices](#best-practices)

---

## 🏗️ Database Overview

### Technology Stack
- **Database**: PostgreSQL 14+ (Supabase)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Migration Tool**: Supabase CLI

### Database Architecture
```
├── Public Schema
│   ├── Core Tables (users, products, orders, etc.)
│   ├── Lookup Tables (categories, system_settings)
│   └── Junction Tables (cart_items, order_items)
├── Auth Schema (Managed by Supabase)
│   ├── users (Supabase managed)
│   └── sessions (Supabase managed)
└── Storage Schema (Supabase managed)
    ├── buckets
    └── objects
```

---

## 🔄 Migration Strategy

### Migration Naming Convention
```
YYYYMMDD_HHMM_description_name.sql

Examples:
- 20240101_0001_initial_schema.sql
- 20240101_0002_create_enums.sql
- 20240101_0003_create_users_table.sql
- 20240101_0004_create_products_table.sql
```

### Migration Order
1. **Enums and Custom Types**
2. **Core Tables** (users, categories)
3. **Dependent Tables** (products, addresses)
4. **Transaction Tables** (orders, payments)
5. **Junction Tables** (cart_items, order_items)
6. **Audit and Log Tables**
7. **Indexes**
8. **RLS Policies**
9. **Functions and Triggers**
10. **Seed Data**

---

## 📊 Schema Creation Scripts

### 1. Enums and Types (Migration: 20240101_0002_create_enums.sql)

```sql
-- User role enum
CREATE TYPE user_role AS ENUM (
    'customer', 
    'cashier', 
    'admin', 
    'super_admin'
);

-- Gender enum
CREATE TYPE gender_type AS ENUM (
    'male', 
    'female', 
    'other', 
    'prefer_not_to_say'
);

-- Product status enum
CREATE TYPE product_status AS ENUM (
    'draft', 
    'active', 
    'inactive', 
    'archived'
);

-- Address type enum
CREATE TYPE address_type AS ENUM (
    'billing', 
    'shipping', 
    'both'
);

-- Order status enum
CREATE TYPE order_status AS ENUM (
    'pending', 
    'confirmed', 
    'processing', 
    'shipped', 
    'delivered', 
    'cancelled', 
    'refunded'
);

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
    'pending', 
    'processing', 
    'completed', 
    'failed', 
    'cancelled', 
    'refunded'
);

-- Fulfillment status enum
CREATE TYPE fulfillment_status AS ENUM (
    'unfulfilled', 
    'partial', 
    'fulfilled', 
    'shipped', 
    'delivered'
);

-- Order channel enum
CREATE TYPE order_channel AS ENUM (
    'online', 
    'pos', 
    'phone', 
    'email'
);

-- Payment method enum
CREATE TYPE payment_method AS ENUM (
    'credit_card', 
    'debit_card', 
    'cash', 
    'bank_transfer', 
    'mobile_money'
);

-- Payment gateway enum
CREATE TYPE payment_gateway AS ENUM (
    'yoco', 
    'paystack', 
    'stripe', 
    'paypal'
);

-- Discount type enum
CREATE TYPE discount_type AS ENUM (
    'percentage', 
    'fixed_amount', 
    'free_shipping'
);

-- Movement type enum
CREATE TYPE movement_type AS ENUM (
    'in', 
    'out', 
    'adjustment', 
    'transfer', 
    'damaged', 
    'returned'
);

-- Audit action enum
CREATE TYPE audit_action AS ENUM (
    'create', 
    'update', 
    'delete', 
    'login', 
    'logout'
);

-- Notification type enum
CREATE TYPE notification_type AS ENUM (
    'order', 
    'payment', 
    'shipping', 
    'inventory', 
    'system', 
    'marketing'
);
```

### 2. Users Table (Migration: 20240101_0003_create_users_table.sql)

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_phone CHECK (phone ~ '^[+]?[0-9\s\-\(\)]+$'),
    CONSTRAINT valid_login_attempts CHECK (login_attempts >= 0 AND login_attempts <= 10)
);

-- Add comments
COMMENT ON TABLE public.users IS 'Extended user information linked to Supabase auth.users';
COMMENT ON COLUMN public.users.role IS 'User role determines system access level';
COMMENT ON COLUMN public.users.two_factor_secret IS 'TOTP secret for two-factor authentication';
```

### 3. User Profiles Table (Migration: 20240101_0004_create_user_profiles.sql)

```sql
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    date_of_birth DATE,
    gender gender_type,
    preferences JSONB DEFAULT '{}',
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Africa/Johannesburg',
    loyalty_points INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    last_order_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id),
    CONSTRAINT valid_dob CHECK (date_of_birth <= CURRENT_DATE),
    CONSTRAINT valid_loyalty_points CHECK (loyalty_points >= 0),
    CONSTRAINT valid_total_spent CHECK (total_spent >= 0)
);

-- Add comments
COMMENT ON TABLE public.user_profiles IS 'Additional user profile information and statistics';
COMMENT ON COLUMN public.user_profiles.preferences IS 'JSON object storing user preferences and settings';
```

### 4. Categories Table (Migration: 20240101_0005_create_categories.sql)

```sql
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    image_url TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(200),
    seo_description TEXT,
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT category_depth_check CHECK (
        CASE 
            WHEN parent_id IS NULL THEN TRUE 
            ELSE (
                SELECT COUNT(*) FROM public.categories c 
                WHERE c.id = parent_id AND c.parent_id IS NOT NULL
            ) <= 2
        END
    ),
    CONSTRAINT valid_sort_order CHECK (sort_order >= 0)
);

-- Add comments
COMMENT ON TABLE public.categories IS 'Product categories with hierarchical structure (max 3 levels)';
COMMENT ON COLUMN public.categories.slug IS 'URL-friendly category identifier';
```

### 5. Products Table (Migration: 20240101_0006_create_products.sql)

```sql
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    compare_at_price DECIMAL(10,2),
    weight DECIMAL(8,2),
    dimensions JSONB,
    barcode VARCHAR(50),
    status product_status DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    requires_shipping BOOLEAN DEFAULT TRUE,
    is_taxable BOOLEAN DEFAULT TRUE,
    tax_rate DECIMAL(5,4) DEFAULT 0.15,
    tags TEXT[],
    attributes JSONB DEFAULT '{}',
    seo_title VARCHAR(200),
    seo_description TEXT,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    
    CONSTRAINT valid_price CHECK (price > 0),
    CONSTRAINT valid_cost_price CHECK (cost_price IS NULL OR cost_price >= 0),
    CONSTRAINT valid_compare_price CHECK (compare_at_price IS NULL OR compare_at_price > price),
    CONSTRAINT valid_weight CHECK (weight IS NULL OR weight > 0),
    CONSTRAINT valid_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 1),
    CONSTRAINT valid_rating CHECK (rating_average >= 0 AND rating_average <= 5),
    CONSTRAINT valid_counts CHECK (rating_count >= 0 AND view_count >= 0 AND sales_count >= 0)
);

-- Add full-text search index
ALTER TABLE public.products ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(brand, '')), 'C') ||
    setweight(to_tsvector('english', array_to_string(tags, ' ')), 'D')
) STORED;

-- Add comments
COMMENT ON TABLE public.products IS 'Main products catalog with full product information';
COMMENT ON COLUMN public.products.dimensions IS 'JSON: {length, width, height, unit}';
COMMENT ON COLUMN public.products.attributes IS 'JSON: flexible product attributes (color, size, material, etc.)';
```

### 6. Product Images Table (Migration: 20240101_0007_create_product_images.sql)

```sql
CREATE TABLE public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    width INTEGER,
    height INTEGER,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_dimensions CHECK (
        (width IS NULL AND height IS NULL) OR 
        (width > 0 AND height > 0)
    ),
    CONSTRAINT valid_file_size CHECK (file_size IS NULL OR file_size > 0),
    CONSTRAINT valid_sort_order CHECK (sort_order >= 0)
);

-- Add comments
COMMENT ON TABLE public.product_images IS 'Product images with metadata and ordering';
COMMENT ON COLUMN public.product_images.is_primary IS 'Only one primary image per product allowed';
```

### 7. Inventory Table (Migration: 20240101_0008_create_inventory.sql)

```sql
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 10,
    reorder_quantity INTEGER DEFAULT 50,
    location VARCHAR(100),
    cost_per_unit DECIMAL(10,2),
    last_counted_at TIMESTAMP WITH TIME ZONE,
    last_received_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id),
    CONSTRAINT valid_quantities CHECK (
        quantity >= 0 AND 
        reserved_quantity >= 0 AND 
        reserved_quantity <= quantity AND
        reorder_point >= 0 AND 
        reorder_quantity > 0
    ),
    CONSTRAINT valid_cost CHECK (cost_per_unit IS NULL OR cost_per_unit >= 0)
);

-- Add computed column for available quantity
ALTER TABLE public.inventory ADD COLUMN available_quantity INTEGER 
GENERATED ALWAYS AS (quantity - reserved_quantity) STORED;

-- Add comments
COMMENT ON TABLE public.inventory IS 'Real-time inventory tracking for all products';
COMMENT ON COLUMN public.inventory.reserved_quantity IS 'Quantity reserved for pending orders';
COMMENT ON COLUMN public.inventory.available_quantity IS 'Computed: quantity - reserved_quantity';
```

### 8. Inventory Movements Table (Migration: 20240101_0009_create_inventory_movements.sql)

```sql
CREATE TABLE public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    movement_type movement_type NOT NULL,
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50),
    reason VARCHAR(255),
    cost_per_unit DECIMAL(10,2),
    notes TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_quantity_change CHECK (
        (movement_type IN ('in', 'adjustment') AND quantity > 0) OR
        (movement_type IN ('out', 'damaged', 'returned') AND quantity < 0) OR
        (movement_type = 'transfer' AND quantity != 0)
    ),
    CONSTRAINT valid_quantity_calculation CHECK (
        (movement_type IN ('in', 'adjustment') AND new_quantity = previous_quantity + ABS(quantity)) OR
        (movement_type IN ('out', 'damaged', 'returned') AND new_quantity = previous_quantity - ABS(quantity)) OR
        (movement_type = 'transfer')
    ),
    CONSTRAINT valid_cost CHECK (cost_per_unit IS NULL OR cost_per_unit >= 0)
);

-- Add comments
COMMENT ON TABLE public.inventory_movements IS 'Complete audit trail of all inventory changes';
COMMENT ON COLUMN public.inventory_movements.reference_id IS 'ID of related record (order, purchase_order, etc.)';
COMMENT ON COLUMN public.inventory_movements.reference_type IS 'Type of reference (order, purchase_order, adjustment, etc.)';
```

### 9. Addresses Table (Migration: 20240101_0010_create_addresses.sql)

```sql
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type address_type NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country_code VARCHAR(2) NOT NULL DEFAULT 'ZA',
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    delivery_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_phone CHECK (phone ~ '^[+]?[0-9\s\-\(\)]+$'),
    CONSTRAINT valid_country CHECK (country_code ~ '^[A-Z]{2}$'),
    CONSTRAINT valid_coordinates CHECK (
        (latitude IS NULL AND longitude IS NULL) OR
        (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
    )
);

-- Add comments
COMMENT ON TABLE public.addresses IS 'User addresses for billing and shipping';
COMMENT ON COLUMN public.addresses.delivery_instructions IS 'Special delivery instructions';
```

### 10. Shopping Carts Table (Migration: 20240101_0011_create_shopping_carts.sql)

```sql
CREATE TABLE public.shopping_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT cart_ownership CHECK (
        (user_id IS NOT NULL AND session_id IS NULL) OR 
        (user_id IS NULL AND session_id IS NOT NULL)
    )
);

-- Add comments
COMMENT ON TABLE public.shopping_carts IS 'Shopping carts for authenticated users and guest sessions';
COMMENT ON COLUMN public.shopping_carts.session_id IS 'For guest users, links to browser session';
```

### 11. Cart Items Table (Migration: 20240101_0012_create_cart_items.sql)

```sql
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES public.shopping_carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(cart_id, product_id),
    CONSTRAINT valid_quantity CHECK (quantity > 0),
    CONSTRAINT valid_unit_price CHECK (unit_price > 0)
);

-- Add computed column for total price
ALTER TABLE public.cart_items ADD COLUMN total_price DECIMAL(10,2) 
GENERATED ALWAYS AS (quantity * unit_price) STORED;

-- Add comments
COMMENT ON TABLE public.cart_items IS 'Items in shopping carts with current pricing';
COMMENT ON COLUMN public.cart_items.unit_price IS 'Price at time of adding to cart';
```

### 12. Orders Table (Migration: 20240101_0013_create_orders.sql)

```sql
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    fulfillment_status fulfillment_status DEFAULT 'unfulfilled',
    channel order_channel NOT NULL DEFAULT 'online',
    currency VARCHAR(3) DEFAULT 'ZAR',
    
    -- Pricing breakdown
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Address information (denormalized for historical record)
    billing_address JSONB,
    shipping_address JSONB,
    
    -- Metadata
    notes TEXT,
    tags TEXT[],
    source_campaign VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Order processing
    cancellation_reason TEXT,
    processed_by UUID REFERENCES public.users(id),
    
    CONSTRAINT valid_amounts CHECK (
        subtotal >= 0 AND 
        tax_amount >= 0 AND 
        shipping_amount >= 0 AND 
        discount_amount >= 0 AND
        total_amount = subtotal + tax_amount + shipping_amount - discount_amount
    ),
    CONSTRAINT valid_timestamps CHECK (
        (confirmed_at IS NULL OR confirmed_at >= created_at) AND
        (shipped_at IS NULL OR shipped_at >= COALESCE(confirmed_at, created_at)) AND
        (delivered_at IS NULL OR delivered_at >= COALESCE(shipped_at, confirmed_at, created_at)) AND
        (cancelled_at IS NULL OR cancelled_at >= created_at)
    )
);

-- Add comments
COMMENT ON TABLE public.orders IS 'Main orders table with complete order information';
COMMENT ON COLUMN public.orders.billing_address IS 'JSON snapshot of billing address at time of order';
COMMENT ON COLUMN public.orders.shipping_address IS 'JSON snapshot of shipping address at time of order';
```

### 13. Order Items Table (Migration: 20240101_0014_create_order_items.sql)

```sql
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    
    -- Product snapshot at time of order
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    product_image_url TEXT,
    
    -- Pricing and quantities
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Product details snapshot
    product_snapshot JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_quantities CHECK (quantity > 0),
    CONSTRAINT valid_pricing CHECK (
        unit_price > 0 AND 
        total_price = (unit_price * quantity) - discount_amount + tax_amount AND
        tax_amount >= 0 AND 
        discount_amount >= 0
    ),
    CONSTRAINT valid_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 1)
);

-- Add comments
COMMENT ON TABLE public.order_items IS 'Individual items within orders with historical product data';
COMMENT ON COLUMN public.order_items.product_snapshot IS 'Complete product details at time of purchase';
```

### 14. Payments Table (Migration: 20240101_0015_create_payments.sql)

```sql
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    payment_method payment_method NOT NULL,
    gateway payment_gateway NOT NULL,
    gateway_transaction_id VARCHAR(255),
    gateway_reference VARCHAR(255),
    status payment_status NOT NULL,
    
    -- Payment amounts
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'ZAR',
    gateway_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2),
    
    -- Refund information
    refunded_amount DECIMAL(10,2) DEFAULT 0,
    refund_reference VARCHAR(255),
    
    -- Gateway response data
    gateway_response JSONB,
    
    -- Processing timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    
    -- Failure information
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    
    CONSTRAINT valid_amounts CHECK (
        amount > 0 AND 
        gateway_fee >= 0 AND
        refunded_amount >= 0 AND 
        refunded_amount <= amount AND
        (net_amount IS NULL OR net_amount = amount - gateway_fee)
    ),
    CONSTRAINT valid_retry_count CHECK (retry_count >= 0 AND retry_count <= 5)
);

-- Add comments
COMMENT ON TABLE public.payments IS 'Payment transactions with gateway integration details';
COMMENT ON COLUMN public.payments.gateway_response IS 'Full gateway response for debugging and reconciliation';
```

### 15. Discounts Table (Migration: 20240101_0016_create_discounts.sql)

```sql
CREATE TABLE public.discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type discount_type NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    
    -- Usage restrictions
    minimum_order_amount DECIMAL(10,2),
    maximum_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_limit_per_customer INTEGER DEFAULT 1,
    times_used INTEGER DEFAULT 0,
    
    -- Validity period
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Product/category restrictions
    applicable_products UUID[],
    applicable_categories UUID[],
    excluded_products UUID[],
    
    -- Metadata
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_value CHECK (
        (type = 'percentage' AND value > 0 AND value <= 100) OR
        (type IN ('fixed_amount', 'free_shipping') AND value >= 0)
    ),
    CONSTRAINT valid_amounts CHECK (
        minimum_order_amount IS NULL OR minimum_order_amount >= 0 AND
        maximum_discount_amount IS NULL OR maximum_discount_amount >= 0
    ),
    CONSTRAINT valid_usage_limits CHECK (
        usage_limit IS NULL OR usage_limit > 0 AND
        usage_limit_per_customer > 0 AND
        times_used >= 0 AND
        (usage_limit IS NULL OR times_used <= usage_limit)
    ),
    CONSTRAINT valid_dates CHECK (
        starts_at < COALESCE(ends_at, '2099-12-31'::timestamp)
    )
);

-- Add comments
COMMENT ON TABLE public.discounts IS 'Discount codes and promotional offers';
COMMENT ON COLUMN public.discounts.applicable_products IS 'Array of product IDs this discount applies to (null = all products)';
```

### 16. Reviews Table (Migration: 20240101_0017_create_reviews.sql)

```sql
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    
    -- Review metadata
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    
    -- Images (optional)
    image_urls TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Moderation
    moderated_by UUID REFERENCES public.users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    moderation_notes TEXT,
    
    -- Prevent duplicate reviews per customer per product
    UNIQUE(product_id, customer_id),
    
    CONSTRAINT valid_counts CHECK (
        helpful_count >= 0 AND 
        reported_count >= 0
    )
);

-- Add comments
COMMENT ON TABLE public.reviews IS 'Product reviews and ratings from customers';
COMMENT ON COLUMN public.reviews.is_verified_purchase IS 'True if customer actually purchased this product';
```

### 17. Notifications Table (Migration: 20240101_0018_create_notifications.sql)

```sql
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Notification data and links
    data JSONB DEFAULT '{}',
    action_url TEXT,
    
    -- Delivery status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery channels
    sent_email BOOLEAN DEFAULT FALSE,
    sent_sms BOOLEAN DEFAULT FALSE,
    sent_push BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    
    CONSTRAINT valid_read_logic CHECK (
        (is_read = FALSE AND read_at IS NULL) OR 
        (is_read = TRUE AND read_at IS NOT NULL)
    )
);

-- Add comments
COMMENT ON TABLE public.notifications IS 'In-app notifications for users';
COMMENT ON COLUMN public.notifications.data IS 'Additional structured data for the notification';

### 18. Audit Logs Table (Migration: 20240101_0019_create_audit_logs.sql)

```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action audit_action NOT NULL,
    
    -- Data changes
    old_values JSONB,
    new_values JSONB,
    
    -- User information
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    
    -- Request context
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for performance
    CONSTRAINT valid_action_data CHECK (
        (action = 'create' AND old_values IS NULL AND new_values IS NOT NULL) OR
        (action = 'update' AND old_values IS NOT NULL AND new_values IS NOT NULL) OR
        (action = 'delete' AND old_values IS NOT NULL AND new_values IS NULL) OR
        (action IN ('login', 'logout'))
    )
);

-- Partition by month for performance
SELECT partman.create_parent(
    p_parent_table => 'public.audit_logs',
    p_control => 'created_at',
    p_type => 'range',
    p_interval => 'monthly'
);

-- Add comments
COMMENT ON TABLE public.audit_logs IS 'Complete audit trail of all system changes';
COMMENT ON COLUMN public.audit_logs.request_id IS 'Links related audit entries from the same request';
```

### 19. System Settings Table (Migration: 20240101_0020_create_system_settings.sql)

```sql
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    data_type VARCHAR(20) NOT NULL DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE,
    is_encrypted BOOLEAN DEFAULT FALSE,
    
    -- Validation
    validation_rules JSONB,
    
    -- Metadata
    category VARCHAR(50),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_data_type CHECK (
        data_type IN ('string', 'number', 'boolean', 'array', 'object')
    )
);

-- Add comments
COMMENT ON TABLE public.system_settings IS 'Application configuration settings';
COMMENT ON COLUMN public.system_settings.validation_rules IS 'JSON schema for value validation';
COMMENT ON COLUMN public.system_settings.is_public IS 'Whether setting can be accessed by frontend';
```

### 20. Purchase Orders Table (Migration: 20240101_0021_create_purchase_orders.sql)

```sql
CREATE TABLE public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    supplier_email VARCHAR(255),
    supplier_phone VARCHAR(20),
    
    -- Order details
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'ZAR',
    
    -- Dates
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    received_date DATE,
    
    -- Notes and terms
    notes TEXT,
    terms TEXT,
    
    -- Metadata
    created_by UUID REFERENCES public.users(id),
    approved_by UUID REFERENCES public.users(id),
    received_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (
        status IN ('draft', 'sent', 'confirmed', 'partial_received', 'received', 'cancelled')
    ),
    CONSTRAINT valid_dates CHECK (
        expected_delivery_date IS NULL OR expected_delivery_date >= order_date AND
        received_date IS NULL OR received_date >= order_date
    ),
    CONSTRAINT valid_amount CHECK (total_amount >= 0)
);

-- Add comments
COMMENT ON TABLE public.purchase_orders IS 'Purchase orders for inventory restocking';
```

### 21. Purchase Order Items Table (Migration: 20240101_0022_create_purchase_order_items.sql)

```sql
CREATE TABLE public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID REFERENCES public.purchase_orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    
    -- Order details
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    
    -- Product snapshot
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(50) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_quantities CHECK (
        quantity_ordered > 0 AND 
        quantity_received >= 0 AND 
        quantity_received <= quantity_ordered
    ),
    CONSTRAINT valid_costs CHECK (
        unit_cost >= 0 AND 
        total_cost = quantity_ordered * unit_cost
    )
);

-- Add comments
COMMENT ON TABLE public.purchase_order_items IS 'Individual items in purchase orders';
```

### 22. Shipments Table (Migration: 20240101_0023_create_shipments.sql)

```sql
CREATE TABLE public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    tracking_number VARCHAR(100) UNIQUE,
    carrier VARCHAR(100),
    service_type VARCHAR(50),
    
    -- Addresses
    origin_address JSONB,
    destination_address JSONB,
    
    -- Package details
    weight DECIMAL(8,2),
    dimensions JSONB,
    declared_value DECIMAL(10,2),
    
    -- Status and tracking
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    tracking_events JSONB DEFAULT '[]',
    
    -- Costs
    shipping_cost DECIMAL(10,2),
    insurance_cost DECIMAL(10,2) DEFAULT 0,
    
    -- Dates
    shipped_at TIMESTAMP WITH TIME ZONE,
    estimated_delivery_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (
        status IN ('pending', 'shipped', 'in_transit', 'delivered', 'returned', 'lost')
    ),
    CONSTRAINT valid_dates CHECK (
        estimated_delivery_at IS NULL OR estimated_delivery_at > shipped_at AND
        delivered_at IS NULL OR delivered_at >= shipped_at
    ),
    CONSTRAINT valid_costs CHECK (
        shipping_cost IS NULL OR shipping_cost >= 0 AND
        insurance_cost >= 0
    )
);

-- Add comments
COMMENT ON TABLE public.shipments IS 'Shipment tracking and logistics information';
COMMENT ON COLUMN public.shipments.tracking_events IS 'Array of tracking events from carrier';
```

---

## 🔒 Row Level Security (RLS) Policies

### RLS Setup (Migration: 20240101_0100_enable_rls.sql)

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
```

### User Policies (Migration: 20240101_0101_create_user_policies.sql)

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND
        role = (SELECT role FROM public.users WHERE id = auth.uid())
    );

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );

-- Admins can update user roles
CREATE POLICY "Admins can update user roles" ON public.users
    FOR UPDATE USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );
```

### Product Policies (Migration: 20240101_0102_create_product_policies.sql)

```sql
-- Everyone can read active products
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (status = 'active');

-- Staff can view all products
CREATE POLICY "Staff can view all products" ON public.products
    FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('cashier', 'admin', 'super_admin')
    );

-- Only admins can create/update/delete products
CREATE POLICY "Admins can manage products" ON public.products
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );
```

### Cart Policies (Migration: 20240101_0103_create_cart_policies.sql)

```sql
-- Users can manage their own carts
CREATE POLICY "Users can manage own carts" ON public.shopping_carts
    FOR ALL USING (
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
        (auth.uid() IS NULL AND session_id = current_setting('app.session_id', true))
    );

-- Users can manage items in their own carts
CREATE POLICY "Users can manage own cart items" ON public.cart_items
    FOR ALL USING (
        cart_id IN (
            SELECT id FROM public.shopping_carts 
            WHERE (user_id = auth.uid()) OR 
                  (session_id = current_setting('app.session_id', true))
        )
    );
```

### Order Policies (Migration: 20240101_0104_create_order_policies.sql)

```sql
-- Customers can view their own orders
CREATE POLICY "Customers can view own orders" ON public.orders
    FOR SELECT USING (customer_id = auth.uid());

-- Staff can view all orders
CREATE POLICY "Staff can view all orders" ON public.orders
    FOR SELECT USING (
        auth.jwt() ->> 'role' IN ('cashier', 'admin', 'super_admin')
    );

-- Staff can update orders
CREATE POLICY "Staff can update orders" ON public.orders
    FOR UPDATE USING (
        auth.jwt() ->> 'role' IN ('cashier', 'admin', 'super_admin')
    );

-- Customers can view their own order items
CREATE POLICY "Customers can view own order items" ON public.order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM public.orders WHERE customer_id = auth.uid()
        )
    );
```

---

## ⚙️ Database Functions

### User Management Functions (Migration: 20240101_0200_create_user_functions.sql)

```sql
-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $
DECLARE
    user_role_result user_role;
BEGIN
    SELECT role INTO user_role_result
    FROM public.users
    WHERE id = user_id;
    
    RETURN COALESCE(user_role_result, 'customer');
END;
$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $
BEGIN
    RETURN (
        SELECT role IN ('admin', 'super_admin')
        FROM public.users
        WHERE id = user_id
    );
END;
$;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $
BEGIN
    INSERT INTO public.users (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Inventory Functions (Migration: 20240101_0201_create_inventory_functions.sql)

```sql
-- Function to check product availability
CREATE OR REPLACE FUNCTION public.check_product_availability(
    product_id UUID,
    requested_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $
DECLARE
    available_qty INTEGER;
BEGIN
    SELECT available_quantity INTO available_qty
    FROM public.inventory
    WHERE product_id = check_product_availability.product_id;
    
    RETURN COALESCE(available_qty, 0) >= requested_quantity;
END;
$;

-- Function to reserve inventory
CREATE OR REPLACE FUNCTION public.reserve_inventory(
    product_id UUID,
    quantity INTEGER,
    reference_id UUID,
    reference_type VARCHAR(50)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $
DECLARE
    current_available INTEGER;
BEGIN
    -- Check availability first
    SELECT available_quantity INTO current_available
    FROM public.inventory
    WHERE product_id = reserve_inventory.product_id;
    
    IF current_available < quantity THEN
        RETURN FALSE;
    END IF;
    
    -- Reserve the inventory
    UPDATE public.inventory
    SET reserved_quantity = reserved_quantity + quantity,
        updated_at = NOW()
    WHERE product_id = reserve_inventory.product_id;
    
    -- Log the movement
    INSERT INTO public.inventory_movements (
        product_id, movement_type, quantity, 
        previous_quantity, new_quantity,
        reference_id, reference_type, reason,
        created_by
    )
    SELECT 
        reserve_inventory.product_id,
        'out',
        -quantity,
        i.quantity,
        i.quantity,
        reserve_inventory.reference_id,
        reserve_inventory.reference_type,
        'Reserved for ' || reference_type,
        auth.uid()
    FROM public.inventory i
    WHERE i.product_id = reserve_inventory.product_id;
    
    RETURN TRUE;
END;
$;

-- Function to update product inventory
CREATE OR REPLACE FUNCTION public.update_inventory(
    product_id UUID,
    quantity_change INTEGER,
    movement_type movement_type,
    reference_id UUID DEFAULT NULL,
    reference_type VARCHAR(50) DEFAULT NULL,
    reason VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $
DECLARE
    current_qty INTEGER;
    new_qty INTEGER;
BEGIN
    -- Get current quantity
    SELECT quantity INTO current_qty
    FROM public.inventory
    WHERE product_id = update_inventory.product_id;
    
    IF current_qty IS NULL THEN
        RAISE EXCEPTION 'Product not found in inventory';
    END IF;
    
    new_qty := current_qty + quantity_change;
    
    -- Prevent negative inventory
    IF new_qty < 0 THEN
        RAISE EXCEPTION 'Insufficient inventory. Available: %, Requested: %', 
            current_qty, ABS(quantity_change);
    END IF;
    
    -- Update inventory
    UPDATE public.inventory
    SET quantity = new_qty,
        updated_at = NOW()
    WHERE product_id = update_inventory.product_id;
    
    -- Log movement
    INSERT INTO public.inventory_movements (
        product_id, movement_type, quantity,
        previous_quantity, new_quantity,
        reference_id, reference_type, reason,
        created_by
    )
    VALUES (
        update_inventory.product_id,
        update_inventory.movement_type,
        quantity_change,
        current_qty,
        new_qty,
        update_inventory.reference_id,
        update_inventory.reference_type,
        update_inventory.reason,
        auth.uid()
    );
    
    RETURN TRUE;
END;
$;
```

### Order Functions (Migration: 20240101_0202_create_order_functions.sql)

```sql
-- Function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $
DECLARE
    order_number VARCHAR(50);
    counter INTEGER;
BEGIN
    -- Get daily counter
    SELECT COUNT(*) + 1 INTO counter
    FROM public.orders
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Format: ORD-YYYYMMDD-####
    order_number := 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                   LPAD(counter::TEXT, 4, '0');
    
    RETURN order_number;
END;
$;

-- Function to calculate order total
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id UUID)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $
DECLARE
    total_amount DECIMAL(10,2);
BEGIN
    SELECT 
        COALESCE(SUM(total_price), 0) + 
        COALESCE(MAX(o.tax_amount), 0) + 
        COALESCE(MAX(o.shipping_amount), 0) - 
        COALESCE(MAX(o.discount_amount), 0)
    INTO total_amount
    FROM public.order_items oi
    JOIN public.orders o ON o.id = oi.order_id
    WHERE oi.order_id = calculate_order_total.order_id;
    
    RETURN COALESCE(total_amount, 0);
END;
$;

-- Function to process order completion
CREATE OR REPLACE FUNCTION public.complete_order(order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $
DECLARE
    order_record RECORD;
    item_record RECORD;
BEGIN
    -- Get order details
    SELECT * INTO order_record
    FROM public.orders
    WHERE id = complete_order.order_id;
    
    IF order_record IS NULL THEN
        RAISE EXCEPTION 'Order not found';
    END IF;
    
    IF order_record.status != 'pending' THEN
        RAISE EXCEPTION 'Order is not in pending status';
    END IF;
    
    -- Update inventory for each order item
    FOR item_record IN 
        SELECT product_id, quantity 
        FROM public.order_items 
        WHERE order_id = complete_order.order_id
    LOOP
        -- Reduce inventory and remove reservation
        PERFORM public.update_inventory(
            item_record.product_id,
            -item_record.quantity,
            'out',
            complete_order.order_id,
            'order',
            'Order completion'
        );
        
        -- Update reserved quantity
        UPDATE public.inventory
        SET reserved_quantity = GREATEST(0, reserved_quantity - item_record.quantity)
        WHERE product_id = item_record.product_id;
    END LOOP;
    
    -- Update order status
    UPDATE public.orders
    SET status = 'confirmed',
        confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = complete_order.order_id;
    
    -- Update customer statistics
    UPDATE public.user_profiles
    SET total_spent = total_spent + order_record.total_amount,
        order_count = order_count + 1,
        last_order_date = NOW()
    WHERE user_id = order_record.customer_id;
    
    -- Update product sales count
    UPDATE public.products
    SET sales_count = sales_count + oi.quantity
    FROM public.order_items oi
    WHERE products.id = oi.product_id
    AND oi.order_id = complete_order.order_id;
    
    RETURN TRUE;
END;
$;
```

---

## 🔄 Triggers and Automation

### Audit Triggers (Migration: 20240101_0300_create_audit_triggers.sql)

```sql
-- Generic audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $
DECLARE
    old_data JSONB;
    new_data JSONB;
    action_type audit_action;
BEGIN
    -- Determine action type
    IF TG_OP = 'INSERT' THEN
        action_type := 'create';
        old_data := NULL;
        new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        action_type := 'update';
        old_data := to_jsonb(OLD);
        new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        action_type := 'delete';
        old_data := to_jsonb(OLD);
        new_data := NULL;
    END IF;

    -- Insert audit record
    INSERT INTO public.audit_logs (
        table_name, record_id, action,
        old_values, new_values,
        user_id, user_email,
        ip_address, user_agent
    )
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        action_type,
        old_data,
        new_data,
        auth.uid(),
        auth.jwt() ->> 'email',
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );

    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$;

-- Create audit triggers for key tables
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_products_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_orders_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_payments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
```

### Timestamp Triggers (Migration: 20240101_0301_create_timestamp_triggers.sql)

```sql
-- Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$;

-- Create triggers for tables with updated_at columns
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shopping_carts_updated_at
    BEFORE UPDATE ON public.shopping_carts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_discounts_updated_at
    BEFORE UPDATE ON public.discounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
    BEFORE UPDATE ON public.purchase_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_order_items_updated_at
    BEFORE UPDATE ON public.purchase_order_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### Product Triggers (Migration: 20240101_0302_create_product_triggers.sql)

```sql
-- Function to create inventory record for new products
CREATE OR REPLACE FUNCTION public.create_product_inventory()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $
BEGIN
    INSERT INTO public.inventory (product_id, quantity)
    VALUES (NEW.id, 0);
    
    RETURN NEW;
END;
$;

-- Trigger to create inventory record
CREATE TRIGGER create_inventory_for_new_product
    AFTER INSERT ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.create_product_inventory();

-- Function to update product rating
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $
DECLARE
    avg_rating DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Calculate new average rating
    SELECT 
        AVG(rating)::DECIMAL(3,2),
        COUNT(*)
    INTO avg_rating, review_count
    FROM public.reviews
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    AND is_approved = TRUE;
    
    -- Update product
    UPDATE public.products
    SET 
        rating_average = COALESCE(avg_rating, 0),
        rating_count = review_count,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$;

-- Trigger to update product rating when reviews change
CREATE TRIGGER update_product_rating_on_review
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();
```

---

## 📈 Indexes and Performance

### Performance Indexes (Migration: 20240101_0400_create_indexes.sql)

```sql
-- User indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_active ON public.users(is_active);
CREATE INDEX idx_users_created_at ON public.users(created_at);

-- Product indexes
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_featured ON public.products(is_featured);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_created_at ON public.products(created_at);
CREATE INDEX idx_products_search_vector ON public.products USING gin(search_vector);
CREATE INDEX idx_products_tags ON public.products USING gin(tags);

-- Category indexes
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_active ON public.categories(is_active);

-- Inventory indexes
CREATE INDEX idx_inventory_product ON public.inventory(product_id);
CREATE INDEX idx_inventory_quantity ON public.inventory(quantity);
CREATE INDEX idx_inventory_available ON public.inventory(available_quantity);
CREATE INDEX idx_inventory_low_stock ON public.inventory(quantity) 
    WHERE quantity <= reorder_point;

-- Order indexes
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_email ON public.orders(customer_email);

-- Order items indexes
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- Payment indexes
CREATE INDEX idx_payments
```

###