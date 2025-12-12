'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  images?: string[];
}

interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharges = subtotal > 5000 ? 0 : 200;
  const total = subtotal + deliveryCharges;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = 'ORD-' + Date.now();
      const newOrder = {
        id: orderId,
        items: cartItems,
        customerInfo: formData,
        subtotal,
        deliveryCharges,
        total,
        paymentMethod: 'Cash on Delivery',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };

      // Send order notification email via backend
      await fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          customerInfo: formData,
          items: cartItems,
          subtotal,
          deliveryCharges,
          discount: 0,
          total,
          paymentMethod: 'Cash on Delivery',
        }),
      });

      // Save order locally
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      window.dispatchEvent(new Event('storage'));
      
      // Clear cart
      localStorage.removeItem('cart');
      setCartItems([]);
      setIsSubmitting(false);
      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      // Still place order locally even if email fails
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: 'ORD-' + Date.now(),
        items: cartItems,
        customerInfo: formData,
        subtotal,
        deliveryCharges,
        total,
        paymentMethod: 'Cash on Delivery',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      window.dispatchEvent(new Event('storage'));
      localStorage.removeItem('cart');
      setCartItems([]);
      setIsSubmitting(false);
      setOrderPlaced(true);
    }
  };

  if (orderPlaced) {
    const orderId = JSON.parse(localStorage.getItem('orders') || '[]').slice(-1)[0]?.id || 'N/A';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl">
                <span className="text-6xl">✅</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-xl text-slate-700 font-semibold mb-2">
              🎉 Thank you for your purchase!
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Your Order ID</p>
                <p className="text-2xl font-bold text-blue-600">{orderId}</p>
              </div>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-slate-700 mb-2">
                <span className="font-semibold">📧 Confirmation:</span> We've saved your order details.
              </p>
              <p className="text-sm text-slate-700 mb-2">
                <span className="font-semibold">📱 Contact:</span> We will call you shortly to confirm delivery.
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold">💳 Payment:</span> Cash on Delivery - Pay when you receive your order.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span> What Happens Next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold text-slate-900">Order Confirmation</p>
                  <p className="text-sm text-slate-600">Our team will call you to verify your order</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold text-slate-900">Order Processing</p>
                  <p className="text-sm text-slate-600">We'll carefully pack your items</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold text-slate-900">Fast Delivery</p>
                  <p className="text-sm text-slate-600">Your order will be delivered to your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/my-orders"
              className="block w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition text-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              📦 View My Orders
            </Link>
            <Link
              href="/shop"
              className="block w-full px-6 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white rounded-xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition text-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              🛍️ Continue Shopping
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-4 border-2 border-gray-300 text-slate-700 rounded-xl font-bold hover:bg-gray-50 transition text-center"
            >
              🏠 Back to Home
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-slate-600 font-medium">Secure Shopping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-slate-600 font-medium">Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">✓</span>
                <span className="text-slate-600 font-medium">Quality Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-3">Secure Checkout</h1>
            <p className="text-xl text-blue-100">Complete your purchase safely and securely</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-gray-200">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🛒</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Your cart is empty</h2>
            <p className="text-slate-600 mb-8 text-lg">Add some amazing products to get started!</p>
            <Link
              href="/shop"
              className="inline-block px-10 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-pink-600 transition shadow-lg text-lg"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-gray-200">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-gray-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Delivery Details</h2>
                    <p className="text-slate-600">Please provide your shipping information</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      👤 Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        📧 Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        📱 Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="03XX-XXXXXXX"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      📍 Complete Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="House #, Street, Area"
                      rows={4}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition resize-none text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        🏙️ City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="City name"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        📮 Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal code"
                        className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      📝 Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions..."
                      rows={3}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition resize-none text-lg"
                    />
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-6 mt-6">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xl">
                      <span className="text-2xl">💳</span> Payment Method
                    </h3>
                    <div className="flex items-center gap-4 bg-white p-5 rounded-xl border-2 border-blue-400 shadow-sm">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        checked
                        readOnly
                        className="w-6 h-6 text-blue-600"
                      />
                      <label htmlFor="cod" className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                        <span className="text-2xl">💵</span> Cash on Delivery
                      </label>
                    </div>
                    <p className="text-sm text-slate-700 mt-4 flex items-center gap-2 font-medium">
                      <span className="text-green-600">✓</span> Pay with cash when your order arrives at your doorstep
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 border-2 border-gray-200">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-gray-200">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200">
                      <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md border-2 border-gray-200">
                        {item.images && item.images.length > 0 ? (
                          item.images[0].startsWith('data:') || item.images[0].startsWith('http') ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{item.images[0]}</span>
                          )
                        ) : (
                          <span className="text-3xl">{item.image}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-base line-clamp-2">{item.name}</p>
                        <p className="text-sm text-slate-600 font-medium mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-orange-600 font-bold text-lg mt-2">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-6 bg-gradient-to-br from-slate-50 to-blue-50 p-5 rounded-2xl border-2 border-gray-200">
                  <div className="flex justify-between text-slate-700 text-lg">
                    <span className="font-semibold">📊 Subtotal</span>
                    <span className="font-bold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 text-lg">
                    <span className="font-semibold">🚚 Delivery</span>
                    <span className="font-bold">
                      {deliveryCharges === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `Rs. ${deliveryCharges}`
                      )}
                    </span>
                  </div>
                  {deliveryCharges > 0 && (
                    <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-3 text-sm text-blue-800 flex items-center gap-2 font-medium">
                      <span>💡</span> Free delivery on orders over Rs. 5,000
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-4 flex justify-between text-xl font-bold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 text-3xl">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <p className="text-base font-bold text-green-900">Secure Checkout</p>
                    <p className="text-sm text-green-700">Your information is safe with us</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full px-6 py-5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition disabled:opacity-50 text-xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin inline-block">⏳</span>
                      Processing Order...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>✓</span> Place Order Now
                    </span>
                  )}
                </button>

                <Link
                  href="/shop"
                  className="block text-center mt-4 text-blue-600 font-bold hover:text-blue-700 text-base hover:underline"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
