'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(cart);
  }, []);
  
  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
  });

  const applyCoupon = () => {
    if (promoCode === '9TANGLE10') {
      setDiscount(0.10);
    } else if (promoCode === '9TANGLE20') {
      setDiscount(0.20);
    } else {
      setDiscount(0);
      alert('Invalid coupon code');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // Simulate payment processing
    if (formData.firstName && formData.email && formData.address && formData.city) {
      setOrderPlaced(true);
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: 'ORD-' + Date.now(),
        items: items,
        customerInfo: formData,
        subtotal: subtotal,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod: 'Cash on Delivery',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      setTimeout(() => {
        clearCart();
        setCheckoutStep(1);
        setOrderPlaced(false);
        window.location.href = '/shop';
      }, 3000);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const subtotal = total;
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Order Placed Confirmation */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center animate-fade-in">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h2 className="text-3xl font-bold mb-2 text-green-600">Order Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your order! We will contact you shortly to confirm your delivery.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-green-800">
                Total Amount: Rs. {finalTotal.toLocaleString()}
              </p>
              <p className="text-xs text-green-700 mt-1">Payment Method: Cash on Delivery</p>
            </div>
            <p className="text-sm text-gray-500">Redirecting you back to shop in 3 seconds...</p>
          </div>
        </div>
      )}

      {/* Cart Header */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold">Shopping Cart & Checkout</h1>
          <p className="text-white/90 mt-2">Step {checkoutStep} of 3: {checkoutStep === 1 ? 'Review Items' : checkoutStep === 2 ? 'Shipping Details' : 'Payment Method'}</p>
        </div>
      </div>

      {/* Checkout Progress */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between mb-8 relative">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 relative">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold mx-auto transition-all ${
                checkoutStep >= step
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step < checkoutStep ? '✓' : step}
              </div>
              <p className={`text-center text-sm mt-2 font-semibold ${checkoutStep >= step ? 'text-orange-600' : 'text-gray-600'}`}>
                {step === 1 ? 'Review Cart' : step === 2 ? 'Shipping' : 'Payment'}
              </p>
              {step < 3 && (
                <div className={`absolute top-6 left-1/2 w-full h-1 ${
                  checkoutStep > step ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-200'
                }`} style={{ zIndex: -1 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
        {items.length === 0 && checkoutStep === 1 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md mx-auto">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Cart is Empty</h2>
            <p className="text-slate-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form Section */}
            <div className="lg:col-span-2">
              {/* STEP 1: Review Cart */}
              {checkoutStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">Review Your Items</h2>
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="bg-white rounded-lg shadow p-4 flex gap-4 border border-gray-200"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                        {item.image}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                        <p className="text-orange-500 font-semibold text-lg mt-2">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Coupon Section */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mt-6">
                    <label className="block font-semibold mb-2 text-slate-700">Apply Promo Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="e.g., 9TANGLE10"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Try: 9TANGLE10 (10%) or 9TANGLE20 (20%)</p>
                  </div>
                </div>
              )}

              {/* STEP 2: Shipping Details */}
              {checkoutStep === 2 && (
                <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-2 text-slate-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-slate-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-slate-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-slate-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-2 text-slate-700">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-slate-700">ZIP Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: Payment Details */}
              {checkoutStep === 3 && (
                <div className="bg-white rounded-lg shadow p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                  
                  {/* Cash on Delivery */}
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        checked
                        readOnly
                        className="w-5 h-5 text-green-600"
                      />
                      <label htmlFor="cod" className="font-bold text-slate-900 text-lg">
                        💵 Cash on Delivery (COD)
                      </label>
                    </div>
                    <p className="text-slate-700 text-sm ml-8">
                      Pay with cash when your order arrives at your doorstep. Simple, safe, and secure!
                    </p>
                  </div>

                  {/* Coming Soon Payment Methods */}
                  <div className="space-y-3">
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 opacity-60">
                      <div className="flex items-center gap-3">
                        <input type="radio" disabled className="w-5 h-5" />
                        <label className="font-semibold text-slate-600">
                          💳 Credit/Debit Card
                        </label>
                        <span className="ml-auto bg-gray-200 text-xs px-2 py-1 rounded-full font-semibold">Coming Soon</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 opacity-60">
                      <div className="flex items-center gap-3">
                        <input type="radio" disabled className="w-5 h-5" />
                        <label className="font-semibold text-slate-600">
                          🏦 Bank Transfer
                        </label>
                        <span className="ml-auto bg-gray-200 text-xs px-2 py-1 rounded-full font-semibold">Coming Soon</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 opacity-60">
                      <div className="flex items-center gap-3">
                        <input type="radio" disabled className="w-5 h-5" />
                        <label className="font-semibold text-slate-600">
                          📱 JazzCash / EasyPaisa
                        </label>
                        <span className="ml-auto bg-gray-200 text-xs px-2 py-1 rounded-full font-semibold">Coming Soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 text-center">
                      🔒 Your order is secure with 9Tangle
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                {/* Order Items Count */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-slate-600">{items.length} item{items.length !== 1 ? 's' : ''} in cart</p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({Math.round(discount * 100)}%)</span>
                      <span>-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-600">Delivery</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>

                  <div className="pt-3 border-t-2 border-gray-200 flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-orange-500">Rs. {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="space-y-3">
                  {checkoutStep > 1 && (
                    <button
                      onClick={() => setCheckoutStep(checkoutStep - 1)}
                      className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      ← Back
                    </button>
                  )}

                  {checkoutStep < 3 && (
                    <button
                      onClick={() => {
                        if (checkoutStep === 1 && items.length > 0) {
                          setCheckoutStep(2);
                        } else if (checkoutStep === 2) {
                          if (!formData.firstName || !formData.email || !formData.address || !formData.city) {
                            alert('Please fill in all required fields (Name, Email, Address, City)');
                            return;
                          }
                          setCheckoutStep(3);
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
                    >
                      {checkoutStep === 1 ? 'Proceed to Shipping →' : 'Proceed to Payment →'}
                    </button>
                  )}

                  {checkoutStep === 3 && (
                    <button
                      onClick={handlePayment}
                      disabled={orderPlaced}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {orderPlaced ? 'Processing...' : `Place Order - Rs. ${finalTotal.toLocaleString()}`}
                    </button>
                  )}

                  {checkoutStep === 1 && (
                    <>
                      <Link
                        href="/shop"
                        className="block w-full py-3 text-center border-2 border-orange-300 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition"
                      >
                        ← Continue Shopping
                      </Link>
                      <Link
                        href="/checkout"
                        className="block w-full py-3 text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition"
                      >
                        Express Checkout 🚀
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-slate-600 text-center">
                    🔒 Secure checkout powered by 9Tangle
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
