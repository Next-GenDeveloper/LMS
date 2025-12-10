'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { useState } from 'react';

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  items: number;
  address: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      amount: 299.99,
      status: 'shipped',
      date: '2024-01-15',
      items: 3,
      address: '123 Main St, New York, NY',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      amount: 149.99,
      status: 'processing',
      date: '2024-01-16',
      items: 2,
      address: '456 Oak Ave, Los Angeles, CA',
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      amount: 499.99,
      status: 'pending',
      date: '2024-01-17',
      items: 5,
      address: '789 Pine Rd, Chicago, IL',
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Williams',
      email: 'sarah@example.com',
      amount: 89.99,
      status: 'delivered',
      date: '2024-01-14',
      items: 1,
      address: '321 Elm St, Houston, TX',
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered') => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 mt-14 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-bold">Order Management</h1>
            <p className="text-white/90 mt-2">Track and manage customer orders</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status === 'all' ? 'All Orders' : status}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold">
                    {filteredOrders.length} Order{filteredOrders.length !== 1 ? 's' : ''}
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left font-semibold text-slate-900">Order ID</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-900">Customer</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-900">Amount</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
                        <th className="px-6 py-4 text-left font-semibold text-slate-900">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition"
                          >
                            <td className="px-6 py-4 font-semibold text-blue-600">{order.id}</td>
                            <td className="px-6 py-4 text-slate-600">{order.customer}</td>
                            <td className="px-6 py-4 font-semibold text-orange-500">${order.amount}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{order.date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 sticky top-24">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold">Order Details</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold text-lg">{selectedOrder.id}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold">{selectedOrder.customer}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-semibold text-sm">{selectedOrder.address}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Items</p>
                      <p className="font-semibold">{selectedOrder.items} product{selectedOrder.items !== 1 ? 's' : ''}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-2xl text-orange-500">${selectedOrder.amount}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Update Status</p>
                      <div className="space-y-2">
                        {(['pending', 'processing', 'shipped', 'delivered'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                            className={`w-full px-4 py-2 rounded-lg font-semibold transition capitalize text-sm ${
                              selectedOrder.status === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition"
                      >
                        Close Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center">
                  <p className="text-slate-500 text-lg">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
