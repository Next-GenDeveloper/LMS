'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Sample Product',
      description: 'This is a sample product',
      price: 99.99,
      category: 'Electronics',
      stock: 10,
      image: '📦',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    image: '📦',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.description) return;

    if (editingId) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...formData } as Product : p));
      setEditingId(null);
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name || '',
        description: formData.description || '',
        price: formData.price || 0,
        category: formData.category || 'Electronics',
        stock: formData.stock || 0,
        image: formData.image || '📦',
      };
      setProducts(prev => [...prev, newProduct]);
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Electronics',
      stock: 0,
      image: '📦',
    });
    setShowForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Electronics',
      stock: 0,
      image: '📦',
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate CSV parsing and upload
    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const newProducts: Product[] = [];

      lines.forEach((line, index) => {
        if (index === 0) return; // Skip header
        const [name, description, price, category, stock, image] = line.split(',').map(v => v.trim());
        if (name) {
          newProducts.push({
            id: Date.now().toString() + index,
            name,
            description: description || 'No description',
            price: parseFloat(price) || 0,
            category: category || 'Electronics',
            stock: parseInt(stock) || 0,
            image: image || '📦',
          });
        }
      });

      // Simulate progress
      let currentCount = 0;
      const interval = setInterval(() => {
        currentCount++;
        setUploadProgress((currentCount / newProducts.length) * 100);
        setUploadedCount(currentCount);

        if (currentCount >= newProducts.length) {
          clearInterval(interval);
          setProducts(prev => [...prev, ...newProducts]);
          setTimeout(() => {
            setShowBulkUpload(false);
            setUploadProgress(0);
            setUploadedCount(0);
          }, 1000);
        }
      }, 200);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 mt-14 md:mt-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold">Product Management</h1>
                <p className="text-white/90 mt-2">Manage your 9Tangle store products</p>
              </div>
              <Link
                href="/shop"
                className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                View Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Action Buttons */}
        {!showForm && (
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition"
            >
              ➕ Add New Product
            </button>
            <button
              onClick={() => setShowBulkUpload(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition"
            >
              📤 Bulk Upload (CSV)
            </button>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Bulk Upload Products</h2>
              
              {uploadProgress === 0 ? (
                <>
                  <p className="text-gray-600 mb-4">Upload a CSV file with the following columns:</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-sm font-mono">
                    <p>name, description, price, category, stock, image</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-blue-500 transition cursor-pointer">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleBulkUpload}
                      className="hidden"
                      id="csvInput"
                    />
                    <label htmlFor="csvInput" className="cursor-pointer">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="font-semibold text-slate-700">Click to upload CSV</p>
                      <p className="text-sm text-gray-500">or drag and drop</p>
                    </label>
                  </div>

                  <button
                    onClick={() => setShowBulkUpload(false)}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Uploading: {uploadedCount} products
                    </p>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{Math.round(uploadProgress)}% complete</p>
                  </div>
                  {uploadProgress === 100 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <p className="text-green-800 font-semibold">✓ Upload complete!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Add Product Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition"
          >
            ➕ Add New Product
          </button>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block font-semibold mb-2 text-slate-700">Product Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block font-semibold mb-2 text-slate-700">Price ($)*</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || 0}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-semibold mb-2 text-slate-700">Category</label>
                  <select
                    name="category"
                    value={formData.category || 'Electronics'}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Electronics</option>
                    <option>Fashion</option>
                    <option>Sports</option>
                    <option>Home</option>
                    <option>Books</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block font-semibold mb-2 text-slate-700">Stock*</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock || 0}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-2 text-slate-700">Description*</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Image Emoji */}
              <div>
                <label className="block font-semibold mb-2 text-slate-700">Product Icon/Emoji</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || '📦'}
                  onChange={handleInputChange}
                  maxLength={2}
                  placeholder="📦"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-2xl"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-slate-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Products ({products.length})</h2>
          </div>

          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Icon</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Stock</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={product.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-4 text-2xl">{product.image}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                      <td className="px-6 py-4 text-orange-500 font-semibold">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-600">{product.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-slate-600 text-lg">No products yet. Add your first product!</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
