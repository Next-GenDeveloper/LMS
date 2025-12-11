'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
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
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col md:flex-row">
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white py-8 mt-14 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-4xl font-bold">Product Upload</h1>
            <p className="text-white/90 mt-2">Upload and manage products for your shop</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-pulse">
              ✓ {successMessage}
            </div>
          )}

          {/* Upload Button */}
          <div className="mb-8 flex gap-4 flex-wrap">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📤 Upload New Product
            </button>
            {uploadedProducts.length > 0 && (
              <button
                onClick={handleClearAllProducts}
                className="px-6 py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition text-lg shadow-lg hover:shadow-xl"
              >
                🗑️ Clear All Products
              </button>
            )}
          </div>

          {/* Features Info */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Upload Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🖼️</span>
                <div>
                  <h3 className="font-semibold text-slate-900">6 Product Images</h3>
                  <p className="text-sm text-slate-600">Upload up to 6 images per product</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl">📝</span>
                <div>
                  <h3 className="font-semibold text-slate-900">Full Details</h3>
                  <p className="text-sm text-slate-600">Add descriptions, specs & features</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl">🏪</span>
                <div>
                  <h3 className="font-semibold text-slate-900">Live on Shop</h3>
                  <p className="text-sm text-slate-600">Products appear instantly in shop</p>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Products */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Uploaded Products ({uploadedProducts.length})</h2>
                <a
                  href="/shop"
                  target="_blank"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-sm"
                >
                  View Shop 🔗
                </a>
              </div>
            </div>

            {uploadedProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Images</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Product</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Category</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Price</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Stock</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Created</th>
                      <th className="px-6 py-4 text-left font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedProducts.map((product, idx) => (
                      <tr key={product.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {product.images.slice(0, 3).map((img, imgIdx) => (
                              <div key={imgIdx} className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                                {img.startsWith('data:') || img.startsWith('http') ? (
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">{img}</span>
                                )}
                              </div>
                            ))}
                            {product.images.length > 3 && (
                              <span className="text-sm text-gray-500 self-center">+{product.images.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-600 line-clamp-1">{product.shortDescription}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{product.category}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-orange-500">Rs. {product.price.toLocaleString()}</p>
                            {product.discountPrice > 0 && (
                              <p className="text-sm text-gray-500 line-through">Rs. {product.discountPrice.toLocaleString()}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
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
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-xl text-slate-600 mb-2">No products uploaded yet</p>
                <p className="text-slate-500">Click "Upload New Product" to add your first product</p>
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
