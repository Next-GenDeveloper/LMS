'use client';

import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    users: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load real data
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    
    setStats({
      products: products.length,
      orders: orders.length,
      revenue: totalRevenue,
      users: 842, // This would come from user management system
    });

    // Get recent orders (last 5)
    const recent = orders.slice(-5).reverse();
    setRecentOrders(recent);
  }, []);

  const statsData = [
    { 
      label: 'Total Products', 
      value: stats.products, 
      icon: '📦', 
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500'
    },
    { 
      label: 'Total Orders', 
      value: stats.orders, 
      icon: '🛒', 
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500'
    },
    { 
      label: 'Revenue', 
      value: `Rs. ${stats.revenue.toLocaleString()}`, 
      icon: '💰', 
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500'
    },
    { 
      label: 'Active Users', 
      value: stats.users, 
      icon: '👥', 
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Premium Dashboard Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 mt-14 md:mt-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-5xl font-extrabold mb-2 bg-clip-text">Admin Dashboard</h1>
                <p className="text-white/90 text-xl">Welcome to 9Tangle Management Center</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-semibold">✓ Real-Time Analytics</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-semibold">✓ Full Control</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-semibold">✓ Premium Tools</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statsData.map((stat, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} rounded-full -mr-16 -mt-16 opacity-50`}></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-green-600 text-xs font-bold">↗ Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Quick Actions */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/product-upload"
                className="group relative bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <span className="text-4xl">📦</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Manage Products</h3>
                  <p className="text-white/90 text-sm mb-4">Upload and manage your product inventory</p>
                  <div className="flex items-center text-sm font-semibold">
                    <span>Go to Products</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/orders"
                className="group relative bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <span className="text-4xl">🛒</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">View Orders</h3>
                  <p className="text-white/90 text-sm mb-4">Track and manage all customer orders</p>
                  <div className="flex items-center text-sm font-semibold">
                    <span>Go to Orders</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>

              <Link
                href="/admin/courses/create"
                className="group relative bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Create Course</h3>
                  <p className="text-white/90 text-sm mb-4">Add new courses with videos and PDFs</p>
                  <div className="flex items-center text-sm font-semibold">
                    <span>Create Now</span>
                    <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Premium Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Recent Orders</h2>
              </div>
              <Link
                href="/admin/orders"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg text-sm"
              >
                View All →
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Order ID</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Customer</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Items</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Amount</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Status</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr key={order.id} className={`border-b border-gray-200 hover:bg-blue-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                        <td className="px-6 py-4 font-bold text-blue-600 text-sm">{order.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900 text-sm">{order.customerInfo.fullName}</p>
                          <p className="text-xs text-slate-600">{order.customerInfo.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                            {order.items.length} items
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                          Rs. {order.total.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800 border-blue-300'
                                : order.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : 'bg-orange-100 text-orange-800 border-orange-300'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            href="/admin/orders"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs font-bold"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">📦</span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-2">No Orders Yet</p>
                <p className="text-slate-600">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
