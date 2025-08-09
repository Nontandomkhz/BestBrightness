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