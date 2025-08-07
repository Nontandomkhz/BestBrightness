import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from './dummyData';
import {
  ShoppingCart, ChevronLeft, CreditCard, Building2, Wallet, FileText,
  CheckCircle, Sparkles, Shield, Lock, Truck, MapPin, Phone, Mail,
  User, Home, Calendar, AlertCircle, Star, Gift
} from 'lucide-react';

const paymentMethods = [
  {
    id: 'stripe',
    name: 'Credit Card (Stripe)',
    icon: CreditCard,
    description: 'Pay securely with your credit card via Stripe',
    fee: '2.9% + R2',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    cardTypes: ['visa', 'mastercard', 'amex']
  },
  {
    id: 'yoco',
    name: 'Yoco Payments',
    icon: Wallet, 
    description: 'Local South African payment provider',
    fee: '2.95%',
    image: 'https://cdn.yoco.co.za/images/yoco-logo-purple.svg',
    cardTypes: ['visa', 'mastercard']
  },
  {
    id: 'paystack',
    name: 'Paystack',
    icon: CreditCard,
    description: 'Fast and secure African payments',
    fee: '2.9%',
    image: 'https://website-v3-assets.paystack.com/logo/paystack-logo.svg',
    cardTypes: ['visa', 'mastercard', 'verve']
  },
  {
    id: 'eft',
    name: 'EFT Bank Transfer',
    icon: Building2,
    description: 'Direct bank transfer (order processing takes 1-2 days)',
    fee: 'Free',
    image: null,
    cardTypes: []
  }
];

const provinces = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 
  'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
];

const deliveryOptions = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    time: '5-7 business days',
    price: 50,
    icon: Truck
  },
  {
    id: 'express',
    name: 'Express Delivery',
    time: '2-3 business days',
    price: 120,
    icon: Truck
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    time: 'Next business day',
    price: 200,
    icon: Truck
  }
];

const generateEFTReference = () => {
  const prefix = 'AFX';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useStore();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [selectedPaymentType, setSelectedPaymentType] = useState('card');
  
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    companyName: '',
    vatNumber: '',
    address: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa'
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    deliveryInstructions: ''
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [eftReference, setEftReference] = useState('');

  useEffect(() => {
    if (selectedPaymentType === 'eft') {
      setEftReference(generateEFTReference());
    }
  }, [selectedPaymentType]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedDeliveryOption = deliveryOptions.find(option => option.id === selectedDelivery);
  const deliveryFee = subtotal > 500 && selectedDelivery === 'standard' ? 0 : selectedDeliveryOption?.price || 0;
  const total = subtotal + deliveryFee;

  const handleBillingChange = (field, value) => {
    setBillingDetails(prev => ({ ...prev, [field]: value }));
    if (sameAsDelivery) {
      if (['firstName', 'lastName', 'phone', 'address', 'address2', 'city', 'province', 'postalCode', 'country'].includes(field)) {
        setDeliveryDetails(prev => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle payment processing based on selected method
    console.log('Processing payment:', {
      method: selectedMethod,
      billing: billingDetails,
      delivery: deliveryDetails,
      deliveryOption: selectedDelivery,
      total
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-300/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
            >
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl group-hover:shadow-lg transition-all duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Secure Checkout
              </h1>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-emerald-50 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>SSL Protected</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-600 ml-1">Trusted by 10k+</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Checkout Form */}
          <div className="flex-1 space-y-8">
            <form onSubmit={handleSubmit}>
              {/* Billing Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-cyan-100/50 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Personal & Billing Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.firstName}
                      onChange={(e) => handleBillingChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.lastName}
                      onChange={(e) => handleBillingChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={billingDetails.email}
                        onChange={(e) => handleBillingChange('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={billingDetails.phone}
                        onChange={(e) => handleBillingChange('phone', e.target.value)}
                        placeholder="+27 XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.idNumber}
                      onChange={(e) => handleBillingChange('idNumber', e.target.value)}
                      placeholder="YYMMDD XXXXXX"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.companyName}
                      onChange={(e) => handleBillingChange('companyName', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={billingDetails.address}
                        onChange={(e) => handleBillingChange('address', e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.address2}
                      onChange={(e) => handleBillingChange('address2', e.target.value)}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.city}
                      onChange={(e) => handleBillingChange('city', e.target.value)}
                      placeholder="Your city"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Province *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.province}
                      onChange={(e) => handleBillingChange('province', e.target.value)}
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                      value={billingDetails.postalCode}
                      onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                      placeholder="0000"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-cyan-100/50 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsDelivery}
                      onChange={(e) => setSameAsDelivery(e.target.checked)}
                      className="w-5 h-5 text-cyan-600 rounded focus:ring-cyan-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Delivery address is the same as billing address
                    </span>
                  </label>
                </div>

                {!sameAsDelivery && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Recipient First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={deliveryDetails.firstName}
                        onChange={(e) => setDeliveryDetails(prev => ({...prev, firstName: e.target.value}))}
                        placeholder="Recipient first name"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Recipient Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={deliveryDetails.lastName}
                        onChange={(e) => setDeliveryDetails(prev => ({...prev, lastName: e.target.value}))}
                        placeholder="Recipient last name"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Recipient Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                          value={deliveryDetails.phone}
                          onChange={(e) => setDeliveryDetails(prev => ({...prev, phone: e.target.value}))}
                          placeholder="+27 XX XXX XXXX"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                          value={deliveryDetails.address}
                          onChange={(e) => setDeliveryDetails(prev => ({...prev, address: e.target.value}))}
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={deliveryDetails.address2}
                        onChange={(e) => setDeliveryDetails(prev => ({...prev, address2: e.target.value}))}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={deliveryDetails.city}
                        onChange={(e) => setDeliveryDetails(prev => ({...prev, city: e.target.value}))}
                        placeholder="Your city"
                      />
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Province *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={deliveryDetails.province}
                        onChange={(e) => setDeliveryDetails(prev => ({...prev, province: e.target.value}))}
                      >
                        <option value="">Select Province</option>
                        {provinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                        value={deliveryDetails.postalCode}
                        onChange={(e) => setDeliveryDetails(prev => ({...prev, postalCode: e.target.value}))}
                        placeholder="0000"
                      />
                    </div>
                  </div>
                )}

                {/* Delivery Options */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Delivery Options</h3>
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`block relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedDelivery === option.id
                          ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryOption"
                        value={option.id}
                        className="sr-only"
                        checked={selectedDelivery === option.id}
                        onChange={() => setSelectedDelivery(option.id)}
                      />
                      <div className="flex items-center gap-4">
                        <option.icon className={`w-6 h-6 ${selectedDelivery === option.id ? 'text-cyan-600' : 'text-gray-400'}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">{option.name}</p>
                            <span className="font-bold text-cyan-600">
                              {option.price === 0 || (subtotal > 500 && option.id === 'standard') ? 'Free' : `R${option.price}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{option.time}</p>
                        </div>
                        <CheckCircle 
                          className={`w-5 h-5 ${
                            selectedDelivery === option.id
                              ? 'text-cyan-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-6 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all duration-200 group-hover:border-gray-300"
                    value={deliveryDetails.deliveryInstructions}
                    onChange={(e) => setDeliveryDetails(prev => ({...prev, deliveryInstructions: e.target.value}))}
                    placeholder="Any special instructions for delivery (gate code, building access, etc.)"
                  />
                </div>
              </div>

              {/* Payment Methods - Updated */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-cyan-100/50 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType('card')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      selectedPaymentType === 'card'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Card Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentType('eft')}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                      selectedPaymentType === 'eft'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>
                
                <div className="space-y-6">
                  {selectedPaymentType === 'card' ? (
                    <>
                      <div className="space-y-4">
                        {paymentMethods
                          .filter(method => method.id !== 'eft')
                          .map((method) => (
                            <label
                              key={method.id}
                              className={`block relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                                selectedMethod === method.id
                                  ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                className="sr-only"
                                checked={selectedMethod === method.id}
                                onChange={() => setSelectedMethod(method.id)}
                              />
                              <div className="flex items-center gap-4">
                                {method.image ? (
                                  <img src={method.image} alt={method.name} className="h-8 object-contain" />
                                ) : (
                                  <method.icon className={`w-6 h-6 ${selectedMethod === method.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-semibold text-gray-900">{method.name}</p>
                                    <span className="text-sm font-medium text-emerald-600">{method.fee}</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{method.description}</p>
                                  {method.cardTypes?.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                      {method.cardTypes.map(card => (
                                        <span
                                          key={card}
                                          className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium text-gray-600 uppercase"
                                        >
                                          {card}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <CheckCircle 
                                  className={`w-5 h-5 ${
                                    selectedMethod === method.id
                                      ? 'text-emerald-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </div>
                            </label>
                          ))}
                      </div>

                      {selectedMethod && selectedMethod !== 'eft' && (
                        <div className="mt-6 p-6 border-2 border-emerald-100 rounded-xl bg-emerald-50/50">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h3>
                          <div className="space-y-4">
                            <div className="group">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Card Number
                              </label>
                              <input
                                type="text"
                                maxLength="19"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                                value={cardDetails.number}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                  setCardDetails(prev => ({...prev, number: value}));
                                }}
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>

                            <div className="group">
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cardholder Name
                              </label>
                              <input
                                type="text"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                                value={cardDetails.name}
                                onChange={(e) => setCardDetails(prev => ({...prev, name: e.target.value}))}
                                placeholder="JOHN SMITH"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength="5"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                                  value={cardDetails.expiry}
                                  onChange={(e) => {
                                    const value = e.target.value
                                      .replace(/\D/g, '')
                                      .replace(/(\d{2})(\d{0,2})/, '$1/$2');
                                    setCardDetails(prev => ({...prev, expiry: value}));
                                  }}
                                  placeholder="MM/YY"
                                />
                              </div>

                              <div className="group">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  CVC
                                </label>
                                <input
                                  type="text"
                                  required
                                  maxLength="4"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all"
                                  value={cardDetails.cvc}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    setCardDetails(prev => ({...prev, cvc: value}));
                                  }}
                                  placeholder="123"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-6 border-2 border-emerald-100 rounded-xl bg-emerald-50/50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">EFT Payment Details</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Reference Number:</span>
                            <span className="font-mono font-bold text-emerald-600">{eftReference}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-900">Bank Details:</h4>
                            <div className="bg-white rounded-lg p-4 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Bank Name:</span>
                                <span className="font-medium">First National Bank</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Account Holder:</span>
                                <span className="font-medium">AfriXchange PTY LTD</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Account Number:</span>
                                <span className="font-mono font-medium">62123456789</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Branch Code:</span>
                                <span className="font-mono font-medium">250655</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Reference:</span>
                                <span className="font-mono font-medium text-emerald-600">{eftReference}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-yellow-600" />
                              <p className="text-sm text-yellow-800">
                                Please use your unique reference number when making the payment. Your order will be processed once payment is received.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedMethod}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
              >
                <Lock className="w-6 h-6" />
                Complete Secure Payment - R{total.toFixed(2)}
                <Sparkles className="w-6 h-6" />
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="max-w-sm w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-cyan-100/50 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-gray-700">
                  <span className="text-sm">{item.name} x {item.quantity}</span>
                  <span className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex justify-between items-center text-gray-900 font-semibold">
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-gray-900 font-semibold">
              <span>Delivery Fee</span>
              <span>R{deliveryFee.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex justify-between items-center text-gray-900 font-bold text-lg">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 bg-cyan-600 text-white py-3 px-4 rounded-xl hover:bg-cyan-700 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;