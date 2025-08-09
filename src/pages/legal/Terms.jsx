import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check, Shield, Scale, AlertCircle } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      title: "Product Usage & Safety",
      items: [
        "Products must be used according to instructions on labels",
        "Keep all cleaning products out of reach of children",
        "Do not mix different cleaning products",
        "Test products on a small area first",
        "Use protective equipment as recommended"
      ]
    },
    {
      title: "Orders & Shipping",
      items: [
        "Free shipping on orders over R500",
        "Delivery within 2-5 business days",
        "Same-day delivery available in selected areas",
        "Products subject to stock availability",
        "Prices include VAT"
      ]
    },
    {
      title: "Returns & Refunds",
      items: [
        "30-day return policy for unopened products",
        "Damaged items must be reported within 48 hours",
        "Refunds processed within 5-7 business days",
        "Original packaging required for returns",
        "Shipping costs non-refundable unless error on our part"
      ]
    },
    {
      title: "Account & Privacy",
      items: [
        "Must be 18+ to create an account",
        "Personal information protected by data laws",
        "Optional marketing communications",
        "Secure payment processing",
        "Account details must be kept confidential"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-cyan-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
              BestBrightness
            </span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
          <p className="mt-2 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-cyan-100">
          <div className="flex items-start gap-3 text-gray-600 mb-4">
            <AlertCircle className="w-5 h-5 text-cyan-600 mt-1" />
            <p>
              By using BestBrightness services and purchasing our products, you agree to these terms. 
              Please read them carefully. These terms are designed to ensure a safe and reliable 
              experience for all our customers.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-100"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-600 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Notice */}
        <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-100">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-cyan-600 mt-1" />
            <div className="space-y-2">
              <p className="text-gray-600">
                These terms and conditions may be updated periodically. Continued use of our services 
                after changes constitutes acceptance of the new terms.
              </p>
              <p className="text-gray-600">
                For questions about these terms, please contact our customer service team at{' '}
                <a href="mailto:support@bestbrightness.com" className="text-cyan-600 hover:text-cyan-700">
                  support@bestbrightness.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
