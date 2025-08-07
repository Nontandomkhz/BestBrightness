// dummyData.js
import { create } from 'zustand';

const useStore = create((set, get) => ({
  cartItems: [],
  addToCart: (productId) => set((state) => {
    // Find product from allProducts
    const product = get().allProducts.find(p => p.id === productId);
    if (!product) return state;

    // Check if item already exists in cart
    const existingItem = state.cartItems.find(item => item.id === productId);
    
    if (existingItem) {
      // If exists, increment quantity
      return {
        cartItems: state.cartItems.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    
    // If doesn't exist, add new item with quantity 1
    return {
      cartItems: [...state.cartItems, { ...product, quantity: 1 }]
    };
  }),
  removeFromCart: (itemId) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== itemId)
  })),
  updateQuantity: (itemId, quantity) => set((state) => ({
    cartItems: state.cartItems.map(item => 
      item.id === itemId ? {...item, quantity: Math.max(1, quantity)} : item
    )
  })),
  allProducts: [
  {
    id: 1,
    name: "Professional Floor Cleaner",
    price: 249.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 124,
    badge: "Best Seller",
    category: "Floor Care",
    brand: "CleanPro",
    inStock: true,
    features: ["Non-toxic", "Quick-dry", "Anti-slip"],
    promoted: true
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
    category: "Disinfectants",
    brand: "SafeClean",
    inStock: true,
    features: ["99.9% Effective", "EPA Approved", "Hospital Grade"]
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
    category: "Laundry",
    brand: "GreenWash",
    inStock: true,
    features: ["Biodegradable", "Plant-based", "Concentrated"],
    promoted: true
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
    category: "Commercial",
    brand: "IndustrialMax",
    inStock: true,
    features: ["Complete Kit", "Heavy Duty", "Professional Grade"]
  },
  {
    id: 5,
    name: "Heavy-Duty Hand Sanitizer",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1584784335604-4f5e5736590b?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 92,
    badge: "Medical Grade",
    category: "Sanitizers",
    brand: "MedClean",
    inStock: true,
    features: ["70% Alcohol", "Moisturizing", "Quick-dry"]
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
    category: "Glass Care",
    brand: "CrystalClear",
    inStock: true,
    features: ["Ammonia-free", "Anti-static", "Streak-free"]
  },
  {
    id: 7,
    name: "Carpet Deep Cleaner",
    price: 319.99,
    originalPrice: 389.99,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center",
    rating: 4.6,
    reviews: 78,
    badge: "Deep Clean",
    category: "Floor Care",
    brand: "CarpetMaster",
    inStock: true,
    features: ["Stain removal", "Odor elimination", "Pet-safe"],
    promoted: true
  },
  {
    id: 8,
    name: "Kitchen Degreaser",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    rating: 4.4,
    reviews: 145,
    badge: "Heavy Duty",
    category: "Kitchen",
    brand: "GrillClean",
    inStock: true,
    features: ["Cuts grease", "Food-safe", "Fast-acting"]
  },
  {
    id: 9,
    name: "Bathroom Mold Remover",
    price: 149.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1620916297893-bebe4a65b822?w=400&h=400&fit=crop&crop=center",
    rating: 4.3,
    reviews: 102,
    badge: "Anti-Mold",
    category: "Bathroom",
    brand: "FreshBath",
    inStock: false,
    features: ["Bleach-free", "Prevents regrowth", "Tile safe"]
  },
  {
    id: 10,
    name: "Air Freshener Spray",
    price: 89.99,
    originalPrice: 109.99,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop&crop=center",
    rating: 4.2,
    reviews: 234,
    badge: "Long Lasting",
    category: "Air Care",
    brand: "AromaPure",
    inStock: true,
    features: ["24hr fresh", "Natural oils", "Non-aerosol"]
  },
  {
    id: 11,
    name: "Microfiber Cleaning Cloths Set",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    rating: 4.8,
    reviews: 189,
    badge: "Value Pack",
    category: "Tools",
    brand: "FiberMax",
    inStock: true,
    features: ["12-pack", "Machine washable", "Lint-free"]
  },
  {
    id: 12,
    name: "Pressure Washer Detergent",
    price: 179.99,
    originalPrice: 219.99,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop&crop=center",
    rating: 4.5,
    reviews: 67,
    badge: "High Power",
    category: "Outdoor",
    brand: "PowerWash",
    inStock: true,
    features: ["Concentrated", "Biodegradable", "Vehicle safe"]
  }
],
  categories: [
    {
      name: "Floor Care",
      count: 2,
      icon: "Droplets" 
    },
    {
      name: "Disinfectants",
      count: 1,
      icon: "Shield" 
    },
    {
      name: "Laundry",
      count: 1,
      icon: "Tshirt" 
    },
    {
      name: "Commercial",
      count: 1,
      icon: "Building" 
    },
    {
      name: "Sanitizers",
      count: 1,
      icon: "HandSanitizer" 
    },
    {
      name: "Glass Care",
      count: 1,
      icon: "Window" 
    },
    {
      name: "Kitchen",
      count: 1,
      icon: "ChefHat" 
    },
    {
      name: "Bathroom",
      count: 1,
      icon: "Bathtub" 
    },
    {
      name: "Air Care",
      count: 1,
      icon: "AirFreshener" 
    },
    {
      name: "Tools",
      count: 1,
      icon: "Tool" 
    },
    {
      name: "Outdoor",
      count: 1,
      icon: "Tree" 
    }
  ]
}));

export default useStore;
export const allProducts = useStore.getState().allProducts;
export const categories = useStore.getState().categories;