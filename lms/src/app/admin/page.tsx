'use client';

import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Products', value: '24', icon: '📦', trend: '+3' },
    { label: 'Total Orders', value: '156', icon: '🛒', trend: '+12' },
    { label: 'Revenue', value: '$12.5K', icon: '💰', trend: '+8%' },
    { label: 'Active Users', value: '842', icon: '👥', trend: '+45' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$299.99', status: 'Shipped' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '$149.99', status: 'Processing' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: '$499.99', status: 'Pending' },
    { id: 'ORD-004', customer: 'Sarah Williams', amount: '$89.99', status: 'Delivered' },
    { id: 'ORD-005', customer: 'Tom Brown', amount: '$199.99', status: 'Processing' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 mt-14 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-white/90 mt-2">Welcome to 9Tangle Admin Panel</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-green-600 text-sm mt-2 font-semibold">{stat.trend} this month</p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/admin/products"
              className="bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-bold text-lg mb-1">Manage Products</h3>
              <p className="text-white/90 text-sm">Add, edit, and manage your products</p>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-2">🛒</div>
              <h3 className="font-bold text-lg mb-1">View Orders</h3>
              <p className="text-white/90 text-sm">Track and manage customer orders</p>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-2">📈</div>
              <h3 className="font-bold text-lg mb-1">Analytics</h3>
              <p className="text-white/90 text-sm">View sales and performance metrics</p>
            </Link>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Order ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{order.id}</td>
                      <td className="px-6 py-4 text-slate-600">{order.customer}</td>
                      <td className="px-6 py-4 font-semibold text-orange-500">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 font-semibold hover:text-blue-700">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
