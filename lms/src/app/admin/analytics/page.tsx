'use client';

export default function AnalyticsPage() {
  const salesData = [
    { month: 'Jan', sales: 12000, orders: 45 },
    { month: 'Feb', sales: 15000, orders: 52 },
    { month: 'Mar', sales: 18000, orders: 61 },
    { month: 'Apr', sales: 16500, orders: 55 },
    { month: 'May', sales: 21000, orders: 72 },
    { month: 'Jun', sales: 24000, orders: 85 },
  ];

  const topProducts = [
    { name: 'Premium Laptop', sales: 156, revenue: 4680 },
    { name: 'Wireless Mouse', sales: 342, revenue: 2052 },
    { name: 'USB-C Cable', sales: 521, revenue: 1563 },
    { name: 'Keyboard', sales: 278, revenue: 2780 },
    { name: 'Monitor Stand', sales: 189, revenue: 945 },
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col md:flex-row">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 mt-14 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-bold">Analytics</h1>
            <p className="text-white/90 mt-2">View sales and performance metrics</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900">$106.5K</p>
              <p className="text-green-600 text-sm mt-2">+15% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900">370</p>
              <p className="text-green-600 text-sm mt-2">+12% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-2">Avg Order Value</p>
              <p className="text-3xl font-bold text-slate-900">$287.84</p>
              <p className="text-red-600 text-sm mt-2">-2% from last month</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <p className="text-gray-600 text-sm font-semibold mb-2">Conversion Rate</p>
              <p className="text-3xl font-bold text-slate-900">3.2%</p>
              <p className="text-green-600 text-sm mt-2">+0.5% from last month</p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold mb-6">Sales Trend (Last 6 Months)</h2>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700">{data.month}</span>
                    <span className="text-orange-500 font-bold">${data.sales.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-8 bg-gray-200 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg"
                      style={{ width: `${(data.sales / maxSales) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{data.orders} orders</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Top Products</h2>
              <div className="space-y-4">
                {topProducts.map((product, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{idx + 1}. {product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} units sold</p>
                      </div>
                      <p className="font-bold text-orange-500">${product.revenue.toLocaleString()}</p>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Demographics */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold mb-6">Customer Insights</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">New Customers</p>
                  <p className="text-2xl font-bold text-blue-600">285</p>
                  <p className="text-xs text-gray-500 mt-1">+32% from last month</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Returning Customers</p>
                  <p className="text-2xl font-bold text-purple-600">557</p>
                  <p className="text-xs text-gray-500 mt-1">+8% from last month</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-green-600">4.6/5.0</p>
                  <p className="text-xs text-gray-500 mt-1">Based on 1,234 reviews</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-gray-600 mb-1">Repeat Purchase Rate</p>
                  <p className="text-2xl font-bold text-orange-600">42%</p>
                  <p className="text-xs text-gray-500 mt-1">+5% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
