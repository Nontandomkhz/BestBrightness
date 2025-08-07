import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, Heart, ChevronLeft, ChevronRight, Tag, Truck, Shield, RefreshCw, Sparkles, Droplets, Zap, Award, Leaf, Users } from 'lucide-react';

// Mock data with Unsplash images
const featuredProducts = [
  {
    id: 1,
    name: "Professional Floor Cleaner",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    category: "Floor Care"
  },
  {
    id: 2,
    name: "Multi-Surface Disinfectant",
    price: 189.99,
    originalPrice: 229.99,
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 89,
    badge: "Antibacterial",
    category: "Disinfectants"
  },
  {
    id: 3,
    name: "Eco-Friendly Laundry Detergent",
    price: 159.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
    rating: 4.9,
    reviews: 156,
    badge: "Eco-Friendly",
    category: "Laundry"
  },
  {
    id: 4,
    name: "Industrial Cleaning Kit",
    price: 899.99,
    originalPrice: 1049.99,
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 67,
    badge: "Pro Choice",
    category: "Commercial"
  }
];

const promotions = [
  {
    id: 1,
    title: "Spring Clean Sale",
    subtitle: "Up to 60% Off Premium Products",
    description: "Refresh your space with professional-grade cleaning solutions",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
    buttonText: "Shop Now",
    bgGradient: "from-cyan-400 via-blue-500 to-teal-600"
  },
  {
    id: 2,
    title: "Eco-Clean Collection",
    subtitle: "100% Natural & Biodegradable",
    description: "Clean consciously with our planet-friendly product range",
    image: "https://images.unsplash.com/photo-1607946831496-6fafd665b4b0?w=1200&h=600&fit=crop",
    buttonText: "Go Green",
    bgGradient: "from-emerald-400 via-green-500 to-teal-500"
  },
  {
    id: 3,
    title: "Hygiene Essentials",
    subtitle: "Hospital-Grade Disinfection",
    description: "Maximum protection with scientifically proven formulations",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&h=600&fit=crop",
    bgGradient: "from-blue-400 via-cyan-500 to-sky-500"
  }
];

const categories = [
  { name: "Surface Cleaners", icon: Sparkles, count: 234, color: "text-cyan-600" },
  { name: "Cleaning Tools", icon: Zap, count: 156, color: "text-blue-600" },
  { name: "Disinfectants", icon: Shield, count: 142, color: "text-teal-600" },
  { name: "Floor Care", icon: Droplets, count: 89, color: "text-sky-600" },
  { name: "Laundry", icon: RefreshCw, count: 167, color: "text-indigo-600" },
  { name: "Commercial", icon: Award, count: 134, color: "text-blue-700" }
];

const HomePage = () => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [cartItems, setCartItems] = useState(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const addToCart = (productId) => {
    setCartItems(prev => new Set([...prev, productId]));
  };

  const ProductCard = ({ product }) => {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    return (
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-cyan-100 overflow-hidden backdrop-blur-sm">
        {/* Product Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
              product.badge === 'Best Seller' ? 'bg-gradient-to-r from-orange-400 to-pink-500' :
              product.badge === 'Antibacterial' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
              product.badge === 'Eco-Friendly' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
              'bg-gradient-to-r from-blue-500 to-indigo-600'
            }`}>
              {product.badge}
            </span>
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full shadow-lg">
              -{discount}%
            </span>
          </div>
        )}

        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-cyan-50 to-blue-50">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-4 right-16 p-2 bg-white/95 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
          >
            <Heart 
              className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>

          {/* Quick Add to Cart */}
          <button
            onClick={() => addToCart(product.id)}
            className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:from-cyan-600 hover:to-blue-700 flex items-center justify-center gap-2 font-medium shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Quick Add
          </button>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-teal-600 uppercase tracking-wider font-semibold">{product.category}</span>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-700 font-medium">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">{product.name}</h3>
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gray-900">R{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">R{product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Decorative Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                CleanBright
              </h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for cleaning products, disinfectants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 bg-white/90 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-xl transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="relative p-2 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-xl transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItems.size > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItems.size}
                  </span>
                )}
              </button>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Promotion Carousel */}
        <section className="relative h-96 overflow-hidden">
          {promotions.map((promo, index) => (
            <div
              key={promo.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === currentPromo ? 'translate-x-0' : 
                index < currentPromo ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              <div className={`w-full h-full bg-gradient-to-r ${promo.bgGradient} relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M50 25a25 25 0 1 1 0 50 25 25 0 0 1 0-50zm0 5a20 20 0 1 0 0 40 20 20 0 0 0 0-40z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '100px 100px'
                  }} className="w-full h-full" />
                </div>
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                  <div className="max-w-2xl text-white">
                    <h2 className="text-5xl font-bold mb-4 leading-tight">{promo.title}</h2>
                    <p className="text-xl mb-2 opacity-95 font-medium">{promo.subtitle}</p>
                    <p className="text-lg mb-8 opacity-85">{promo.description}</p>
                    <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 inline-flex items-center gap-2 shadow-xl">
                      {promo.buttonText}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Carousel Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromo(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentPromo ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Carousel Controls */}
          <button
            onClick={() => setCurrentPromo(prev => prev === 0 ? promotions.length - 1 : prev - 1)}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentPromo(prev => (prev + 1) % promotions.length)}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </section>

        {/* Features Bar */}
        <section className="bg-white/90 backdrop-blur-md py-6 border-b border-cyan-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-16">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="font-medium">Free Shipping Over R500</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-medium">30-Day Returns</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <span className="font-medium">Secure Payments</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600 text-lg">Find the perfect cleaning solution for every need</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer border border-cyan-100 hover:border-cyan-200 hover:-translate-y-1"
                  >
                    <div className="mb-4 mx-auto w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className={`w-8 h-8 ${category.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} products</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white/50 backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/50 to-blue-50/50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                <p className="text-gray-600 text-lg">Premium cleaning solutions trusted by professionals</p>
              </div>
              <button className="text-cyan-600 hover:text-cyan-800 font-semibold flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl hover:bg-white transition-all">
                View All Products
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Special Offers Banner */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-teal-600 rounded-3xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.4'%3E%3Cpolygon points='60,30 90,90 30,90'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '120px 120px'
                }} className="w-full h-full" />
              </div>
              <div className="px-12 py-16 text-white text-center relative">
                <div className="mb-6 mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Tag className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-bold mb-6">Hygiene Sale Event</h2>
                <p className="text-xl opacity-95 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Stock up on essential cleaning supplies with massive discounts! Professional-grade products 
                  for homes and businesses. Limited time offer - don't miss out!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-xl">
                    Shop Deals Now
                  </button>
                  <button className="border-2 border-white/80 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200 backdrop-blur-sm">
                    Browse Categories
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-gradient-to-br from-teal-50 to-cyan-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-cyan-100">
              <div className="mb-6 mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Fresh & Informed</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Get exclusive access to new products, professional cleaning tips, and special offers 
                delivered to your inbox. Join our community of cleanliness enthusiasts!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none bg-white/90 backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-lg">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                ✨ We respect your privacy. Unsubscribe anytime with one click.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20h40v40H20V20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }} className="w-full h-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  CleanBright Solutions
                </h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted partner for professional cleaning supplies and hygiene solutions. 
                Serving homes and businesses across South Africa.
              </p>
              <div className="flex gap-4">
                <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <Users className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <Star className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">About CleanBright</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Contact Us</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Product Catalog</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Bulk Orders</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Safety Data Sheets</button></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold mb-6 text-white">Customer Care</h4>
              <ul className="space-y-3 text-gray-400">
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Track Your Order</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Returns & Exchanges</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Cleaning Guides</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Product Support</button></li>
                <li><button className="hover:text-white transition-colors hover:translate-x-1 transform duration-200">Customer Reviews</button></li>
              </ul>
            </div>

            {/* Contact & Legal */}
            <div>
              <h4 className="font-semibold mb-6 text-white">Get In Touch</h4>
              <div className="space-y-4 text-gray-400 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-cyan-600/20 rounded">
                    <Truck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm">Free delivery in Durban</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-teal-600/20 rounded">
                    <Shield className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-sm">Licensed & Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-green-600/20 rounded">
                    <Leaf className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm">Eco-friendly options</span>
                </div>
              </div>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><button className="hover:text-gray-300 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-gray-300 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-gray-300 transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 CleanBright Solutions. All rights reserved. Professional cleaning supplies for a healthier tomorrow.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Serving South Africa
                </span>
                <span>Est. 2018</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;