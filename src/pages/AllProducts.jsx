import React, { useState } from 'react';
import { Search, ShoppingCart, Star, Heart, Filter, SlidersHorizontal } from 'lucide-react';

// Expanded mock data (reuse and extend the existing products)
const allProducts = [
  // ...existing products from Home.jsx...
  {
    id: 5,
    name: "Heavy-Duty Hand Sanitizer",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1584784335604-4f5e5736590b?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 92,
    badge: "Medical Grade",
    category: "Sanitizers"
  },
  {
    id: 6,
    name: "Glass & Window Cleaner",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&h=400&fit=crop&crop=center",
    rating: 4.7,
    reviews: 113,
    badge: "Streak-Free",
    category: "Glass Care"
  }
];

const categories = [
  "All Categories",
  "Floor Care",
  "Disinfectants",
  "Laundry",
  "Commercial",
  "Sanitizers",
  "Glass Care"
];

const AllProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState(new Set());
  const [cartItems, setCartItems] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredProducts = allProducts
    .filter(product => 
      (selectedCategory === 'All Categories' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Header with Search */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort */}
        <div className={`grid grid-cols-1 md:grid-cols-[250px,1fr] gap-8 ${showFilters ? '' : 'hidden md:grid'}`}>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cyan-100">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      selectedCategory === category
                        ? 'bg-cyan-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-gray-200 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-cyan-100 overflow-hidden"
                >
                  <div className="relative aspect-square">
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
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cyan-600 font-medium">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">R{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            R{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="p-2 text-cyan-600 hover:text-cyan-700"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
