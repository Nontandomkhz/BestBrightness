import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore, { allProducts, categories } from './dummyData';
import { 
  Search, ShoppingCart, Star, Heart, Filter, SlidersHorizontal, 
  Grid3X3, List, X, ChevronDown, ChevronUp, Tag, Truck, Shield, 
  RefreshCw, Sparkles, Droplets, Zap, Award, Leaf, Users, Eye,
  ArrowUpDown, Clock, TrendingUp, Package, Percent
} from 'lucide-react';

const brands = [...new Set(allProducts.map(product => product.brand))];
brands.unshift('All Brands');

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under R100", min: 0, max: 100 },
  { label: "R100 - R200", min: 100, max: 200 },
  { label: "R200 - R300", min: 200, max: 300 },
  { label: "R300 - R500", min: 300, max: 500 },
  { label: "Over R500", min: 500, max: Infinity }
];

const AllProductsPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [promotedOnly, setPromotedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Advanced filtering and sorting
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
        const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand;
        const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
        const matchesStock = !inStockOnly || product.inStock;
        const matchesPromo = !promotedOnly || product.promoted;
        const matchesRating = product.rating >= minRating;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice && 
               matchesStock && matchesPromo && matchesRating;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.id - a.id;
          case 'popular':
            return b.reviews - a.reviews;
          case 'discount':
            const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
            const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
            return discountB - discountA;
          default:
            return 0;
        }
      });
  }, [searchQuery, selectedCategory, selectedBrand, selectedPriceRange, inStockOnly, promotedOnly, minRating, sortBy]);

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

  const clearAllFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedBrand('All Brands');
    setSelectedPriceRange(priceRanges[0]);
    setInStockOnly(false);
    setPromotedOnly(false);
    setMinRating(0);
    setSearchQuery('');
  };

  const ProductCard = ({ product, isListView = false }) => {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    if (isListView) {
      return (
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-cyan-100 overflow-hidden">
          <div className="flex">
            <div className="w-48 h-48 relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-2 py-1 text-xs font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-cyan-600 font-medium">{product.category}</span>
                    <span className="text-sm text-gray-500">by {product.brand}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">R{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">R{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="p-2 text-gray-400 hover:text-cyan-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => addToCart(product.id)} // Only pass the ID
                      disabled={!product.inStock}
                      className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-cyan-100 overflow-hidden">
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 text-xs font-semibold rounded-full text-white bg-gradient-to-r from-cyan-500 to-blue-600">
              {product.badge}
            </span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full">
              -{discount}%
            </span>
          </div>
        )}

        <div className="relative aspect-square bg-gradient-to-br from-cyan-50 to-blue-50">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="flex gap-2">
              <button
                onClick={() => toggleFavorite(product.id)}
                className="flex-1 bg-white/95 text-gray-700 py-2 px-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-sm font-medium">Favorite</span>
              </button>
              <button
                onClick={() => setQuickViewProduct(product)}
                className="bg-white/95 text-gray-700 p-2 rounded-xl hover:bg-white transition-all"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-cyan-600 uppercase tracking-wider font-semibold">{product.category}</span>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-700 font-medium">{product.rating}</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-3">by {product.brand}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 2).map((feature, idx) => (
              <span key={idx} className="text-xs bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">R{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">R{product.originalPrice}</span>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <button
            onClick={() => addToCart(product.id)} // Only pass the ID
            disabled={!product.inStock}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                All Products
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, brands, features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-cyan-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 bg-white/90"
                />
              </div>
              <button 
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-gray-800"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Free shipping over R500</span>
            </div>
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              <span>Up to 30% off selected items</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Same day delivery in Durban</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar - Now full height */}
        <div className={`w-[280px] min-h-screen bg-white border-r border-cyan-100 p-6 space-y-6 sticky top-0 ${
          showFilters ? 'block' : 'hidden lg:block'
        }`}>
          {/* Active Filters */}
          {(selectedCategory !== 'All Categories' || selectedBrand !== 'All Brands' || selectedPriceRange.label !== 'All Prices' || inStockOnly || promotedOnly || minRating > 0) && (
            <div className="bg-cyan-50 rounded-2xl p-6 shadow-sm border border-cyan-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Active Filters</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-cyan-600 hover:text-cyan-800 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== 'All Categories' && (
                  <span className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('All Categories')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== 'All Brands' && (
                  <span className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand('All Brands')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Categories Filter */}
          <div className="bg-white rounded-2xl shadow-sm border border-cyan-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-600" />
              Categories
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs opacity-75">({category.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cyan-100">
            <h3 className="font-semibold text-gray-900 mb-4">Brands</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedBrand === brand
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cyan-100">
            <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map(range => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(range)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedPriceRange.label === range.label
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cyan-100">
            <h3 className="font-semibold mb-4 text-gray-900">Minimum Rating</h3>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 3.0, 0].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    minRating === rating
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{rating > 0 ? `${rating} & up` : 'All ratings'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cyan-100">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={promotedOnly}
                  onChange={(e) => setPromotedOnly(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">Featured Products</span>
              </label>
            </div>
          </div>

          {/* Special Offers */}
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-6 text-white">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Flash Sale!</h3>
              <p className="text-sm opacity-90 mb-4">Up to 30% off selected cleaning supplies. Limited time offer!</p>
              <button className="bg-white text-orange-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Takes remaining space */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-100 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory}
              </h2>
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {allProducts.length} products
                {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-200"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white text-cyan-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-cyan-400 bg-white"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Best Deals</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured/Promoted Products Banner */}
          {!searchQuery && selectedCategory === 'All Categories' && (
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden mb-6">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">🔥 Featured Products</h3>
                    <p className="opacity-90">Hand-picked products with the best reviews and value</p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-75" />
                </div>
                <button
                  onClick={() => setPromotedOnly(!promotedOnly)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {promotedOnly ? 'Show All Products' : 'View Featured Only'}
                </button>
              </div>
            </div>
          )}

          {/* Product Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6' 
                : 'space-y-4'
              }
            `}>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  isListView={viewMode === 'list'} 
                />
              ))}
            </div>
          )}

          {/* Load More Button (if needed) */}
          {filteredProducts.length > 0 && filteredProducts.length >= 12 && (
            <div className="text-center pt-8">
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 font-medium">
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Quick View</h3>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-cyan-600 font-medium">{quickViewProduct.category}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">by {quickViewProduct.brand}</span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{quickViewProduct.name}</h2>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(quickViewProduct.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {quickViewProduct.rating} ({quickViewProduct.reviews} reviews)
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      quickViewProduct.inStock 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {quickViewProduct.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold text-gray-900">R{quickViewProduct.price}</span>
                    {quickViewProduct.originalPrice > quickViewProduct.price && (
                      <span className="text-xl text-gray-500 line-through">R{quickViewProduct.originalPrice}</span>
                    )}
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.features.map((feature, idx) => (
                        <span key={idx} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct.id);
                        setQuickViewProduct(null);
                      }}
                      disabled={!quickViewProduct.inStock}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleFavorite(quickViewProduct.id)}
                      className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(quickViewProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Features Bar */}
      <div className="bg-white/90 backdrop-blur-md border-t border-cyan-100 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-3 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl">
                <Truck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="font-semibold">Free Shipping</div>
                <div className="text-sm text-gray-500">On orders over R500</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">Easy Returns</div>
                <div className="text-sm text-gray-500">30-day return policy</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold">Secure Payment</div>
                <div className="text-sm text-gray-500">256-bit SSL encryption</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold">Expert Support</div>
                <div className="text-sm text-gray-500">24/7 customer service</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20h40v40H20V20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px'
            }} 
            className="w-full h-full" 
          />
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
                  BestBrightness Solutions
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
                &copy; 2025 BestBrightness Solutions. All rights reserved. Professional cleaning supplies for a healthier tomorrow.
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

export default AllProductsPage;