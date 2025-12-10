'use client';

import { useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'processing' | 'shipped' | 'in-transit' | 'delivered';
  items: OrderItem[];
  total: number;
  trackingNumber: string;
  shippingAddress: string;
}

const statusSteps = ['processing', 'shipped', 'in-transit', 'delivered'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'in-transit':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return '✓';
    case 'in-transit':
      return '🚚';
    case 'shipped':
      return '📦';
    case 'processing':
      return '⏳';
    default:
      return '❓';
  }
};

export default function OrderTracking() {
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-22',
      status: 'delivered',
      items: [
        { id: '1', name: 'Premium Laptop', quantity: 1, price: 999.99, image: '💻' },
        { id: '2', name: 'USB-C Cable', quantity: 2, price: 19.99, image: '🔌' },
      ],
      total: 1039.97,
      trackingNumber: 'TRACK123456789',
      shippingAddress: '123 Main St, New York, NY 10001',
    },
    {
      id: 'ORD-002',
      orderDate: '2024-01-18',
      estimatedDelivery: '2024-01-25',
      status: 'in-transit',
      items: [
        { id: '3', name: 'Wireless Mouse', quantity: 1, price: 49.99, image: '🖱️' },
      ],
      total: 49.99,
      trackingNumber: 'TRACK987654321',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    },
    {
      id: 'ORD-003',
      orderDate: '2024-01-20',
      estimatedDelivery: '2024-01-27',
      status: 'shipped',
      items: [
        { id: '4', name: 'Mechanical Keyboard', quantity: 1, price: 129.99, image: '⌨️' },
      ],
      total: 129.99,
      trackingNumber: 'TRACK456789123',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getProgressPercentage = (status: string) => {
    const index = statusSteps.indexOf(status);
    return ((index + 1) / statusSteps.length) * 100;
  };

  const getStepStatus = (stepStatus: string, currentStatus: string) => {
    const currentIndex = statusSteps.indexOf(currentStatus);
    const stepIndex = statusSteps.indexOf(stepStatus);
    return stepIndex <= currentIndex;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-block mb-4 text-white/80 hover:text-white">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Order Tracking</h1>
          <p className="text-white/90 mt-2">Track your 9Tangle orders in real-time</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-lg shadow-lg p-6 border-2 cursor-pointer transition ${
                      selectedOrder?.id === order.id
                        ? 'border-blue-600 shadow-xl'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{order.id}</h3>
                        <p className="text-sm text-gray-600">Ordered: {order.orderDate}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500"
                          style={{ width: `${getProgressPercentage(order.status)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <p className="text-gray-600">{order.items.length} item(s)</p>
                        <p className="font-bold text-orange-500">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">Est. Delivery</p>
                        <p className="font-semibold">{order.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-xl text-slate-600 mb-4">No orders found</p>
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 sticky top-24">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                  <h2 className="text-2xl font-bold">{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: <span className="font-semibold">{selectedOrder.status}</span>
                  </p>
                </div>

                {/* Timeline */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-bold text-slate-900 mb-4">Delivery Status</h3>
                  <div className="space-y-4">
                    {statusSteps.map((step, idx) => (
                      <div key={step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              getStepStatus(step, selectedOrder.status)
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {getStepStatus(step, selectedOrder.status) ? '✓' : idx + 1}
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div
                              className={`w-1 h-8 ${
                                getStepStatus(statusSteps[idx + 1], selectedOrder.status)
                                  ? 'bg-green-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 capitalize">{step}</p>
                          <p className="text-sm text-gray-600">
                            {step === 'delivered'
                              ? 'Order delivered'
                              : step === 'in-transit'
                              ? 'On the way to you'
                              : step === 'shipped'
                              ? 'Package picked up'
                              : 'Order being prepared'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Info */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-bold text-slate-900 mb-3">Tracking Information</h3>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Tracking Number</p>
                    <p className="font-mono font-bold text-slate-900">{selectedOrder.trackingNumber}</p>
                  </div>
                  <button className="w-full px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-sm">
                    Track on Carrier Website
                  </button>
                </div>

                {/* Items */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-bold text-slate-900 mb-3">Items ({selectedOrder.items.length})</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1 text-sm">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-orange-500 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-bold text-slate-900 mb-3">Shipping Address</h3>
                  <p className="text-sm text-slate-700">{selectedOrder.shippingAddress}</p>
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-2xl text-orange-500">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
                <p className="text-slate-500 text-lg">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
