'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { useState, useEffect } from 'react';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'customer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
        } catch (e) {
          console.error('Failed to load orders');
        }
      }
    };

    loadOrders();

    // Poll for new orders every 2 seconds
    const interval = setInterval(loadOrders, 2000);

    return () => clearInterval(interval);
  }, []);

  // Search and filter orders
  let filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(order => 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerInfo.phone.includes(searchQuery) ||
      order.customerInfo.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort orders
  filteredOrders = [...filteredOrders].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'amount':
        comparison = a.total - b.total;
        break;
      case 'customer':
        comparison = a.customerInfo.fullName.localeCompare(b.customerInfo.fullName);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

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

  const updateOrderStatus = (orderId: string, newStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;

  // Send email notification
  const sendEmailNotification = (order: Order) => {
    setSelectedOrder(order);
    
    // Auto-fill email based on status
    const statusMessages: Record<string, { subject: string, message: string }> = {
      'Pending': {
        subject: `Order Confirmation - ${order.id}`,
        message: `Dear ${order.customerInfo.fullName},\n\nThank you for your order! Your order ${order.id} has been received and is being processed.\n\nOrder Details:\n- Total: Rs. ${order.total.toLocaleString()}\n- Items: ${order.items.length}\n- Delivery Address: ${order.customerInfo.address}, ${order.customerInfo.city}\n\nWe will contact you shortly to confirm delivery.\n\nBest regards,\n9Tangle Team`
      },
      'Processing': {
        subject: `Order Processing - ${order.id}`,
        message: `Dear ${order.customerInfo.fullName},\n\nGreat news! Your order ${order.id} is now being processed.\n\nOur team is carefully preparing your items for shipment.\n\nBest regards,\n9Tangle Team`
      },
      'Shipped': {
        subject: `Order Shipped - ${order.id}`,
        message: `Dear ${order.customerInfo.fullName},\n\nYour order ${order.id} has been shipped and is on its way!\n\nExpected delivery: 2-3 business days\nDelivery Address: ${order.customerInfo.address}, ${order.customerInfo.city}\n\nThank you for shopping with us!\n\nBest regards,\n9Tangle Team`
      },
      'Delivered': {
        subject: `Order Delivered - ${order.id}`,
        message: `Dear ${order.customerInfo.fullName},\n\nYour order ${order.id} has been successfully delivered!\n\nWe hope you enjoy your purchase. Please contact us if you have any questions.\n\nThank you for choosing 9Tangle!\n\nBest regards,\n9Tangle Team`
      },
      'Cancelled': {
        subject: `Order Cancelled - ${order.id}`,
        message: `Dear ${order.customerInfo.fullName},\n\nYour order ${order.id} has been cancelled as requested.\n\nIf you have any questions, please contact our support team.\n\nBest regards,\n9Tangle Team`
      }
    };

    const template = statusMessages[order.status] || statusMessages['Pending'];
    setEmailSubject(template.subject);
    setEmailMessage(template.message);
    setShowEmailModal(true);
  };

  const handleSendEmail = () => {
    if (!selectedOrder) return;
    
    // Simulate email sending (in production, this would call an API)
    alert(`Email notification sent to ${selectedOrder.customerInfo.email || selectedOrder.customerInfo.phone}\n\nSubject: ${emailSubject}\n\nMessage: ${emailMessage}`);
    
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailMessage('');
  };

  const deleteOrder = (orderId: string) => {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      const updatedOrders = orders.filter(o => o.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const exportOrders = () => {
    const csv = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Address', 'Total', 'Status', 'Date', 'Items Count'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customerInfo.fullName,
        order.customerInfo.email || 'N/A',
        order.customerInfo.phone,
        `"${order.customerInfo.address}, ${order.customerInfo.city}"`,
        order.total,
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
        order.items.length
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12 mt-14 md:mt-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold mb-1">Order Management System</h1>
                <p className="text-white/90 text-lg">Track, process, and manage all customer orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Stats Cards */}
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
                  <span className="text-2xl font-bold">{pendingOrders}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Pending Orders</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">✅</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{completedOrders}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Completed</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💰</span>
                <div className="text-right">
                  <span className="text-xl font-bold">Rs. {totalRevenue.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Total Revenue</p>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, Phone, or Email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'customer')}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="date">📅 Sort by Date</option>
                  <option value="amount">💰 Sort by Amount</option>
                  <option value="customer">👤 Sort by Customer</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl hover:bg-gray-200 font-bold"
                >
                  {sortOrder === 'asc' ? '⬆️' : '⬇️'}
                </button>

                <button
                  onClick={exportOrders}
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 shadow-lg"
                >
                  📥 Export
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-gray-200">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition capitalize text-sm ${
                    filter === status
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? '📋 All Orders' : `${getStatusIcon(status)} ${status}`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200">
                <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📋</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Orders List ({filteredOrders.length})
                    </h2>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-100 to-gray-100 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Order ID</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Customer</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Items</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Total</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Status</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Date</th>
                        <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order, idx) => (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                            } ${selectedOrder?.id === order.id ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
                          >
                            <td className="px-6 py-4 font-bold text-blue-600 text-sm">{order.id}</td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{order.customerInfo.fullName}</p>
                                <p className="text-xs text-slate-600">{order.customerInfo.phone}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 text-sm">
                              Rs. {order.total.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)} {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sendEmailNotification(order);
                                  }}
                                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs font-bold"
                                  title="Send Email"
                                >
                                  📧
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOrder(order.id);
                                  }}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs font-bold"
                                  title="Delete Order"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="text-4xl">{searchQuery ? '🔍' : '📦'}</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900 mb-2">
                              {searchQuery ? 'No matching orders found' : 'No orders found'}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {searchQuery ? 'Try adjusting your search query' : 'Orders will appear here when customers make purchases'}
                            </p>
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold text-sm"
                              >
                                Clear Search
                              </button>
                            )}
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
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <span>👤</span> Customer Information
                      </p>
                      <p className="font-bold text-slate-900">{selectedOrder.customerInfo.fullName}</p>
                      <p className="text-sm text-slate-700 mt-1">📧 {selectedOrder.customerInfo.email || 'N/A'}</p>
                      <p className="text-sm text-slate-700">📱 {selectedOrder.customerInfo.phone}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <span>📍</span> Shipping Address
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedOrder.customerInfo.address}</p>
                      <p className="text-sm text-slate-700 mt-1">{selectedOrder.customerInfo.city}, {selectedOrder.customerInfo.postalCode}</p>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
                        <span>🛍️</span> Order Items ({selectedOrder.items.length})
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex gap-3 bg-white p-2 rounded-lg border border-gray-200">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {item.images && item.images.length > 0 ? (
                                item.images[0].startsWith('data:') || item.images[0].startsWith('http') ? (
                                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <span className="text-xl">{item.images[0]}</span>
                                )
                              ) : (
                                <span className="text-xl">{item.image}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-xs text-slate-900 line-clamp-1">{item.name}</p>
                              <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                              <p className="text-xs font-bold text-orange-500">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Notes */}
                    {selectedOrder.customerInfo.notes && (
                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
                          <span>📝</span> Order Notes
                        </p>
                        <p className="text-sm text-slate-700">{selectedOrder.customerInfo.notes}</p>
                      </div>
                    )}

                    {/* Payment & Pricing */}
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

                    {/* Update Status */}
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span>🔄</span> Update Order Status
                      </p>
                      <div className="space-y-2">
                        {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                            className={`w-full px-4 py-3 rounded-xl font-bold transition text-sm flex items-center justify-center gap-2 ${
                              selectedOrder.status === status
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                : 'bg-gray-100 text-slate-600 hover:bg-gray-200 border border-gray-300'
                            }`}
                          >
                            {getStatusIcon(status)} {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-200">
                      <p className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <span>⚡</span> Quick Actions
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={() => sendEmailNotification(selectedOrder)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                        >
                          📧 Send Email Notification
                        </button>
                        <button
                          onClick={() => deleteOrder(selectedOrder.id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition shadow-lg flex items-center justify-center gap-2"
                        >
                          🗑️ Delete Order
                        </button>
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
                  <p className="text-lg font-bold text-slate-900 mb-2">No Order Selected</p>
                  <p className="text-slate-600 text-sm">Click on any order to view full details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Notification Modal */}
      {showEmailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Send Email Notification</h2>
                <p className="text-sm text-slate-600">Order: {selectedOrder.id}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-sm font-semibold text-slate-700 mb-1">Recipient</p>
                <p className="text-slate-900 font-bold">{selectedOrder.customerInfo.fullName}</p>
                <p className="text-sm text-slate-600">
                  {selectedOrder.customerInfo.email || selectedOrder.customerInfo.phone}
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Message</label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSendEmail}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
              >
                📧 Send Email
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailSubject('');
                  setEmailMessage('');
                }}
                className="px-6 py-3 bg-gray-200 text-slate-700 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
