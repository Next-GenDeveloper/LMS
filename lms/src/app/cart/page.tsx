'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
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
    if (formData.firstName && formData.email && formData.cardNumber) {
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        setCheckoutStep(1);
        setOrderPlaced(false);
        alert('Order placed successfully!');
      }, 3000);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const subtotal = total;
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;
  const tax = finalTotal * 0.08;
  const grandTotal = finalTotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Order Placed Confirmation */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            <p className="text-sm text-gray-500">Redirecting you back to shop in 3 seconds...</p>
          </div>
        </div>
      )}

      {/* Cart Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold">Shopping Cart & Checkout</h1>
          <p className="text-white/90 mt-2">Step {checkoutStep} of 3: {checkoutStep === 1 ? 'Review Items' : checkoutStep === 2 ? 'Shipping & Billing' : 'Payment'}</p>
        </div>
      </div>

      {/* Checkout Progress */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold mx-auto ${
                checkoutStep >= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step < checkoutStep ? '✓' : step}
              </div>
              <p className="text-center text-sm mt-2 text-gray-600">
                {step === 1 ? 'Review Cart' : step === 2 ? 'Shipping' : 'Payment'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
        {items.length === 0 && checkoutStep === 1 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-slate-600 mb-4">Your cart is empty</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Continue Shopping
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
                          ${(item.price * item.quantity).toFixed(2)}
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
                  <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-2 text-slate-700">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s/g, '');
                          handleInputChange({
                            target: { name: 'cardNumber', value: val.slice(0, 16) }
                          } as any);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        placeholder="4532 1234 5678 9010"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-2 text-slate-700">Expiry Date</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            let formatted = val;
                            if (val.length >= 2) {
                              formatted = val.slice(0, 2) + '/' + val.slice(2, 4);
                            }
                            handleInputChange({
                              target: { name: 'cardExpiry', value: formatted }
                            } as any);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-slate-700">CVC</label>
                        <input
                          type="text"
                          name="cardCVC"
                          value={formData.cardCVC}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            handleInputChange({
                              target: { name: 'cardCVC', value: val.slice(0, 3) }
                            } as any);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        💳 Test Card: 4532123456789010 | Any future date | Any CVC
                      </p>
                    </div>
                  </form>
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
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({Math.round(discount * 100)}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (8%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t-2 border-gray-200 flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-orange-500">${grandTotal.toFixed(2)}</span>
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
                        } else if (checkoutStep === 2 && formData.firstName && formData.email) {
                          setCheckoutStep(3);
                        }
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
                    >
                      Next Step →
                    </button>
                  )}

                  {checkoutStep === 3 && (
                    <button
                      onClick={handlePayment}
                      disabled={orderPlaced}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {orderPlaced ? 'Processing...' : `Place Order - $${grandTotal.toFixed(2)}`}
                    </button>
                  )}

                  {checkoutStep === 1 && (
                    <Link
                      href="/shop"
                      className="block w-full py-3 text-center border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Continue Shopping
                    </Link>
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
