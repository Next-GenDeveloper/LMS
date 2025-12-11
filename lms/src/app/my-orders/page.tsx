'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  images?: string[];
}

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  subtotal: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [userPhone, setUserPhone] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  useEffect(() => {
    // Get user phone from localStorage or session
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        setUserPhone(profile.phone || '');
      } catch (e) {
        console.error('Failed to load user profile');
      }
    }
  }, []);

  useEffect(() => {
    if (userPhone || searchPhone) {
      loadOrders();
    }
  }, [userPhone, searchPhone]);

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const phoneToSearch = searchPhone || userPhone;
    
    if (phoneToSearch) {
      const myOrders = allOrders.filter((order: Order) => 
        order.customerInfo.phone === phoneToSearch
      );
      setOrders(myOrders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Pending':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '✅';
      case 'Shipped':
        return '🚚';
      case 'Processing':
        return '⚙️';
      case 'Pending':
        return '⏳';
      case 'Cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">📦</span>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold mb-1">My Orders</h1>
              <p className="text-white/90 text-lg">Track and view your order history</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Phone Search Form */}
        {!userPhone && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Find Your Orders</h2>
                <p className="text-sm text-slate-600">Enter your phone number to view your order history</p>
              </div>
            </div>
            <form onSubmit={handlePhoneSearch} className="flex gap-3">
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="Enter your phone number (03XX-XXXXXXX)"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
              >
                Search Orders
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📊</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{orders.length}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Total Orders</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⏳</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Active Orders</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">✅</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{orders.filter(o => o.status === 'Delivered').length}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Completed</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💰</span>
                <div className="text-right">
                  <span className="text-xl font-bold">Rs. {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Total Spent</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200">
              <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Order History ({orders.length})
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-5 rounded-xl border-2 transition cursor-pointer ${
                          selectedOrder?.id === order.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-blue-600 text-lg">{order.id}</p>
                            <p className="text-xs text-slate-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">{order.items.length} items</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-sm text-slate-600">{order.paymentMethod}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-600">Total</p>
                            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                              Rs. {order.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-5xl">📦</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mb-2">No Orders Found</p>
                    <p className="text-slate-600 mb-6">You haven't placed any orders yet</p>
                    <Link
                      href="/shop"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-pink-600 transition shadow-lg"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 sticky top-24">
                <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
                  </div>
                </div>

                <div className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Order ID */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Order ID</p>
                    <p className="font-bold text-lg text-blue-600">{selectedOrder.id}</p>
                    <p className="text-xs text-slate-600 mt-2">
                      Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <span>📊</span> Order Status
                    </p>
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
                      <span>🛍️</span> Order Items ({selectedOrder.items.length})
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-200">
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.images && item.images.length > 0 ? (
                              item.images[0].startsWith('data:') || item.images[0].startsWith('http') ? (
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <span className="text-2xl">{item.images[0]}</span>
                              )
                            ) : (
                              <span className="text-2xl">{item.image}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-900 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-bold text-orange-500">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                      <span>📍</span> Delivery Address
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedOrder.customerInfo.address}</p>
                    <p className="text-sm text-slate-700 mt-1">{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postalCode}</p>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-4 rounded-xl border-2 border-orange-200">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-semibold">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Delivery:</span>
                        <span className="font-semibold">{selectedOrder.deliveryCharges === 0 ? 'FREE' : `Rs. ${selectedOrder.deliveryCharges}`}</span>
                      </div>
                      <div className="border-t-2 border-orange-300 pt-2 flex justify-between">
                        <span className="font-bold text-slate-900">Total:</span>
                        <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                          Rs. {selectedOrder.total.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-orange-200">
                        <p className="text-xs text-slate-600">💳 Payment: <span className="font-semibold">{selectedOrder.paymentMethod}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-200">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="w-full px-4 py-3 bg-gray-200 text-slate-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👆</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mb-2">Select an Order</p>
                <p className="text-slate-600 text-sm">Click on any order to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Shop */}
        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
          >
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
