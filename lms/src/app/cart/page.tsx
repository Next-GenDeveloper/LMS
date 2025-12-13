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
  const [isInitialized, setIsInitialized] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Load cart from localStorage and listen for updates
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(cart);
    };
    
    loadCart();
    setIsInitialized(true);
    
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);
  
  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isInitialized]);
  
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
    if (confirm('Are you sure you want to clear your cart?')) {
      setItems([]);
      localStorage.removeItem('cart');
    }
  };
  
  const applyCoupon = () => {
    if (promoCode === '9TANGLE10') {
      setDiscount(0.10);
      alert('✅ 10% discount applied!');
    } else if (promoCode === '9TANGLE20') {
      setDiscount(0.20);
      alert('✅ 20% discount applied!');
    } else {
      setDiscount(0);
      alert('❌ Invalid coupon code');
    }
  };
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * discount;
  const deliveryCharges = subtotal > 5000 ? 0 : 200;
  const total = subtotal - discountAmount + deliveryCharges;

  return (
    <div className="min-h-screen bg-white relative isolate">
      {/* Clean Header */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-3">Shopping Cart</h1>
            <p className="text-xl text-orange-100">Review your items and proceed to checkout</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-gray-200">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Your Cart is Empty</h2>
            <p className="text-slate-600 mb-8 text-lg">Looks like you haven't added any items yet.</p>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-pink-600 transition shadow-lg text-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header with Clear Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-slate-900">Cart Items ({items.length})</h2>
                <button
                  onClick={clearCart}
                  className="px-4 py-2 text-red-600 border-2 border-red-300 rounded-lg hover:bg-red-50 font-semibold transition"
                >
                  Clear Cart
                </button>
              </div>

              {/* Cart Items List */}
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200 hover:shadow-xl transition"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-pink-100 rounded-xl flex items-center justify-center text-5xl flex-shrink-0 shadow-md overflow-hidden">
                      {item.image && item.image.startsWith('data:image') ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl">{item.image || '📦'}</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-900 mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-orange-600 mb-4">
                        Rs. {item.price.toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-semibold">Quantity:</span>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 bg-white rounded-lg hover:bg-gray-200 transition font-bold text-lg shadow-sm"
                          >
                            −
                          </button>
                          <span className="w-16 text-center font-bold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 bg-white rounded-lg hover:bg-gray-200 transition font-bold text-lg shadow-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Total & Remove */}
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-slate-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold text-sm transition border-2 border-red-200"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Promo Code Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200 mt-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xl">
                  <span className="text-2xl">🎟️</span> Have a Promo Code?
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g., 9TANGLE10)"
                    className="flex-1 px-5 py-4 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg font-semibold"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-lg transition shadow-lg"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-sm text-blue-700 mt-3 font-medium">
                  💡 Try: <span className="font-bold">9TANGLE10</span> (10% off) or <span className="font-bold">9TANGLE20</span> (20% off)
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 border-2 border-gray-200">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-slate-700 font-semibold">Subtotal ({items.length} items)</span>
                    <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-lg bg-green-50 p-3 rounded-lg border-2 border-green-200">
                      <span className="text-green-700 font-semibold">
                        Discount ({Math.round(discount * 100)}%)
                      </span>
                      <span className="font-bold text-green-600">-Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg">
                    <span className="text-slate-700 font-semibold">Delivery Charges</span>
                    <span className="font-bold">
                      {deliveryCharges === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span className="text-slate-900">Rs. {deliveryCharges}</span>
                      )}
                    </span>
                  </div>

                  {deliveryCharges > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 text-sm text-blue-800 font-medium">
                      💡 Free delivery on orders over Rs. 5,000
                    </div>
                  )}

                  <div className="pt-4 border-t-2 border-gray-300 flex justify-between text-2xl">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-green-900">Secure Checkout</p>
                    <p className="text-sm text-green-700">100% safe & protected</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    className="block w-full px-6 py-5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition text-xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all text-center"
                  >
                    Proceed to Checkout 🚀
                  </Link>

                  <Link
                    href="/shop"
                    className="block w-full px-6 py-4 border-2 border-orange-300 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition text-center text-lg"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                  <div className="flex flex-wrap justify-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-slate-600 font-medium">Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-slate-600 font-medium">Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-slate-600 font-medium">Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
