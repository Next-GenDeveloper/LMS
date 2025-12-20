'use client';

import { useState, useEffect } from 'react';
import ProductUploadModal from '@/components/ProductUploadModal';

interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  discountPrice: number;
  stock: number;
  image: string;
  images: string[];
  specifications: { key: string; value: string }[];
  features: string[];
  rating: number;
  reviews: number;
  createdAt: string;
}

export default function ProductUploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedProducts, setUploadedProducts] = useState<Product[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Load products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('uploadedProducts');
    if (stored) {
      try {
        const products = JSON.parse(stored);
        setUploadedProducts(products);
      } catch (e) {
        console.error('Failed to load products');
      }
    }
  }, []);

  const handleProductAdded = (product: Product) => {
    const updatedProducts = [product, ...uploadedProducts];
    setUploadedProducts(updatedProducts);
    
    // Save to localStorage with error handling
    try {
      localStorage.setItem('uploadedProducts', JSON.stringify(updatedProducts));
      
      // Show success message
      setSuccessMessage(`Product "${product.name}" added successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      // If quota exceeded, remove oldest products and try again
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Keep only last 10 products
        const limitedProducts = updatedProducts.slice(0, 10);
        setUploadedProducts(limitedProducts);
        
        try {
          localStorage.setItem('uploadedProducts', JSON.stringify(limitedProducts));
          setSuccessMessage(`Product "${product.name}" added! (Older products removed due to storage limit)`);
          setTimeout(() => setSuccessMessage(''), 4000);
        } catch (e) {
          setSuccessMessage('Error: Storage full. Please clear some products first.');
          setTimeout(() => setSuccessMessage(''), 4000);
        }
      } else {
        setSuccessMessage('Error saving product. Please try again.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = uploadedProducts.filter(p => p.id !== id);
      setUploadedProducts(updatedProducts);
      localStorage.setItem('uploadedProducts', JSON.stringify(updatedProducts));
      
      setSuccessMessage('Product deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleClearAllProducts = () => {
    if (confirm('Are you sure you want to delete ALL products? This cannot be undone!')) {
      setUploadedProducts([]);
      localStorage.removeItem('uploadedProducts');
      
      setSuccessMessage('All products cleared successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col md:flex-row">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Modern Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 mt-14 md:mt-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl">📤</span>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold mb-1">Product Upload Center</h1>
                <p className="text-white/90 text-lg">Upload and manage your e-commerce inventory</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-semibold">✓ Multi-Image Upload</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-semibold">✓ Instant Live Preview</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-semibold">✓ Rich Product Details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📦</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{uploadedProducts.length}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Total Products</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">✓</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{uploadedProducts.filter(p => p.stock > 0).length}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">In Stock</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⚠️</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">{uploadedProducts.filter(p => p.stock === 0).length}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Out of Stock</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📂</span>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">{[...new Set(uploadedProducts.map(p => p.category))].length}</span>
                </div>
              </div>
              <p className="text-white/90 text-sm font-medium">Categories</p>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mb-8 flex gap-4 flex-wrap">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-3"
            >
              <span className="text-2xl">📤</span> Upload New Product
            </button>
            {uploadedProducts.length > 0 && (
              <button
                onClick={handleClearAllProducts}
                className="px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition text-lg shadow-xl hover:shadow-2xl flex items-center gap-2"
              >
                <span className="text-xl">🗑️</span> Clear All Products
              </button>
            )}
            <a
              href="/shop"
              target="_blank"
              className="px-6 py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition text-lg shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">🏪</span> View Shop
            </a>
          </div>

          {/* Features Info */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Powerful Upload Features</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">6 Product Images</h3>
                    <p className="text-sm text-slate-600">Upload up to 6 high-quality images per product</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Rich Details</h3>
                    <p className="text-sm text-slate-600">Add descriptions, specifications & features</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Instant Live</h3>
                    <p className="text-sm text-slate-600">Products appear instantly in your shop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Products */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
            <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Product Inventory ({uploadedProducts.length})</h2>
                </div>
              </div>
            </div>

            {uploadedProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Images</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Product Details</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Category</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Price</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Stock</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Rating</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Created</th>
                      <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedProducts.map((product, idx) => (
                      <tr key={product.id} className={`border-b border-gray-200 hover:bg-blue-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {product.images.slice(0, 3).map((img, imgIdx) => (
                              <div key={imgIdx} className="w-12 h-12 rounded-lg border-2 border-gray-300 overflow-hidden bg-white shadow-sm flex items-center justify-center hover:scale-110 transition">
                                {img.startsWith('data:') || img.startsWith('http') ? (
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-2xl">{img}</span>
                                )}
                              </div>
                            ))}
                            {product.images.length > 3 && (
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-700">+{product.images.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                            <p className="text-xs text-slate-600 line-clamp-1 mt-1">{product.shortDescription}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                              Rs. {product.price.toLocaleString()}
                            </p>
                            {product.discountPrice > 0 && (
                              <p className="text-xs text-gray-500 line-through">Rs. {product.discountPrice.toLocaleString()}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-700 border border-green-300'
                              : 'bg-red-100 text-red-700 border border-red-300'
                          }`}>
                            {product.stock > 0 ? `✓ ${product.stock}` : '✕ Out'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                            <span className="text-xs text-slate-500">({product.reviews})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600">
                          {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition text-xs font-bold shadow-md hover:shadow-lg"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">📦</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-2">No products uploaded yet</p>
                <p className="text-slate-600 mb-6">Start building your product catalog</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-600 transition shadow-lg"
                >
                  Upload Your First Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Upload Modal */}
      <ProductUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
}
