'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: '9Tangle',
    storeEmail: 'admin@9tangle.com',
    storeTax: '8%',
    freeShippingThreshold: '50',
    currency: 'USD',
    timezone: 'EST',
    maintenance: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 mt-14 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="text-white/90 mt-2">Manage store configuration and preferences</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {/* Success Message */}
          {saved && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-pulse">
              ✓ Settings saved successfully!
            </div>
          )}

          {/* Store Settings */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Store Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block font-semibold text-slate-700 mb-2">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">Store Email</label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleChange('storeEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>JPY</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>EST</option>
                    <option>CST</option>
                    <option>MST</option>
                    <option>PST</option>
                    <option>UTC</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Settings */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Pricing & Shipping</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Sales Tax (%)</label>
                  <input
                    type="number"
                    value={settings.storeTax}
                    onChange={(e) => handleChange('storeTax', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">Free Shipping Threshold ($)</label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => handleChange('freeShippingThreshold', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 Orders over ${settings.freeShippingThreshold} will qualify for free shipping
                </p>
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Maintenance</h2>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-semibold text-slate-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Keep your store offline while making updates</p>
              </div>
              <button
                onClick={() => handleChange('maintenance', !settings.maintenance)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  settings.maintenance ? 'bg-red-600' : 'bg-green-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    settings.maintenance ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {settings.maintenance && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  ⚠️ Your store is currently in maintenance mode and customers cannot place orders.
                </p>
              </div>
            )}
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>

            <div className="space-y-4">
              {[
                { label: 'Email notifications for new orders', key: 'emailOrders' },
                { label: 'Email notifications for low stock', key: 'emailStock' },
                { label: 'Email notifications for customer reviews', key: 'emailReviews' },
                { label: 'Daily sales summary email', key: 'emailDaily' },
              ].map((item) => (
                <div key={item.key} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                  <input
                    type="checkbox"
                    id={item.key}
                    defaultChecked
                    className="w-5 h-5 cursor-pointer"
                  />
                  <label htmlFor={item.key} className="font-semibold text-slate-700 cursor-pointer">
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}