'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  shortDescription?: string;
  longDescription?: string;
  specifications?: { key: string; value: string }[];
  features?: string[];
}

const DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality sound with noise cancellation',
    price: 129.99,
    image: '🎧',
    category: 'Electronics',
    stock: 15,
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    name: 'Leather Messenger Bag',
    description: 'Stylish and durable genuine leather',
    price: 89.99,
    image: '👜',
    category: 'Fashion',
    stock: 8,
    rating: 4.6,
    reviews: 156,
  },
  {
    id: '3',
    name: 'Smart Watch Pro',
    description: 'Latest technology with health tracking',
    price: 299.99,
    image: '⌚',
    category: 'Electronics',
    stock: 12,
    rating: 4.9,
    reviews: 312,
  },
  {
    id: '4',
    name: 'Running Shoes X1',
    description: 'Comfortable and lightweight for all terrains',
    price: 79.99,
    image: '👟',
    category: 'Fashion',
    stock: 20,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: '5',
    name: 'Portable Power Bank',
    description: '20000mAh fast charging capacity',
    price: 39.99,
    image: '🔋',
    category: 'Electronics',
    stock: 25,
    rating: 4.5,
    reviews: 98,
  },
  {
    id: '6',
    name: 'Premium Camera Lens',
    description: 'Professional grade with crystal clear images',
    price: 449.99,
    image: '📷',
    category: 'Electronics',
    stock: 5,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: '7',
    name: 'Yoga Mat Pro',
    description: 'Non-slip surface with carrying strap',
    price: 29.99,
    image: '🧘',
    category: 'Sports',
    stock: 18,
    rating: 4.4,
    reviews: 145,
  },
  {
    id: '8',
    name: 'Coffee Maker Deluxe',
    description: 'Programmable with thermal carafe',
    price: 149.99,
    image: '☕',
    category: 'Home',
    stock: 10,
    rating: 4.6,
    reviews: 78,
  },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Load uploaded products from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('uploadedProducts');
    if (stored) {
      try {
        const uploadedProducts = JSON.parse(stored);
        const allProducts = [...uploadedProducts, ...DEMO_PRODUCTS];
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (e) {
        console.error('Failed to load uploaded products');
      }
    }
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, sortBy, products]);

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setCartCount(prev => prev + 1);
    // Store in localStorage for cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch custom event to update navbar cart
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show compact toast notification
    const toastDiv = document.createElement('div');
    toastDiv.className = 'fixed top-20 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-xl animate-fade-in flex items-center gap-2';
    toastDiv.innerHTML = `
      <span class="text-xl">✓</span>
      <p class="text-sm font-semibold">Added to cart!</p>
    `;
    document.body.appendChild(toastDiv);
    setTimeout(() => {
      toastDiv.remove();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
      {/* Modern Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🛍️</span>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">9Tangle Store</h1>
              <p className="text-xl text-blue-200">Discover premium products at unbeatable prices</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm font-semibold">✓ Free Shipping Over Rs. 5,000</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm font-semibold">✓ Cash on Delivery</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-sm font-semibold">✓ Secure Shopping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Search */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-slate-900 flex items-center gap-2">
                  <span className="text-blue-500">🔍</span> Search
                </h3>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                />
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-slate-900 flex items-center gap-2">
                  <span className="text-blue-500">📂</span> Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                          : 'text-slate-700 hover:bg-blue-50 border border-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-slate-900 flex items-center gap-2">
                  <span className="text-blue-500">⚡</span> Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm font-medium"
                >
                  <option value="latest">Latest Products</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border-2 border-blue-200">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <span>💡</span> Shopping Tips
                </h4>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Free delivery over Rs. 5,000</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Secure cash on delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Quality guaranteed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Header with count */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-blue-500">🏪</span>
                    {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    <span className="font-semibold text-blue-600">{filteredProducts.length}</span> products available
                  </p>
                </div>
                <div className="text-right bg-gradient-to-br from-orange-50 to-pink-50 px-4 py-3 rounded-lg border-2 border-orange-200">
                  <div className="text-2xl font-bold text-orange-500">{cartCount}</div>
                  <p className="text-xs text-slate-600 font-medium">in cart</p>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-blue-400 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-52 bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center overflow-hidden">
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {product.images && product.images.length > 0 ? (
                          product.images[0].startsWith('data:') || product.images[0].startsWith('http') ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-7xl">{product.images[0]}</span>
                          )
                        ) : (
                          <span className="text-7xl">{product.image}</span>
                        )}
                      </div>
                      {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Only {product.stock} left!
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <div className="mb-3">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 text-lg group-hover:text-blue-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                        <div className="flex text-yellow-400 text-sm">
                          {'⭐'.repeat(Math.floor(product.rating))}
                        </div>
                        <span className="text-xs text-slate-700 font-semibold">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Stock Info */}
                      <div className="mb-4">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stock > 0 ? `✓ ${product.stock} In Stock` : '✕ Out of Stock'}
                        </span>
                      </div>

                      {/* Price and Button */}
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xs text-slate-500 font-medium">Price</p>
                            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                              Rs. {product.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          disabled={product.stock === 0}
                          className={`w-full px-4 py-3 rounded-lg font-bold transition-all text-sm ${
                            product.stock > 0
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {product.stock > 0 ? '🛒 Add to Cart' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-xl font-bold text-slate-900 mb-2">No products found</p>
                <p className="text-slate-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-2xl text-white/80 hover:text-white">✕</button>
            </div>

            <div className="p-8 space-y-6 max-h-[calc(90vh-100px)] overflow-y-auto">
              {/* Images Gallery */}
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Product Images</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {selectedProduct.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border-2 border-gray-200 hover:border-blue-500 transition overflow-hidden"
                      >
                        {img.startsWith('data:') || img.startsWith('http') ? (
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl">{img}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedProduct.image?.startsWith('data:') || selectedProduct.image?.startsWith('http') ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl">{selectedProduct.image}</span>
                  )}
                </div>
              )}

              {/* Basic Info */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900">Product Information</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Category</p>
                      <p className="text-lg font-semibold text-slate-900">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">Stock Status</p>
                      <p className={`text-lg font-semibold ${selectedProduct.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.stock > 0 ? `${selectedProduct.stock} Available` : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900">Pricing</h3>
                <div className="space-y-2">
                  {selectedProduct.discountPrice && selectedProduct.discountPrice > 0 ? (
                    <>
                      <div className="flex items-center gap-3">
                        <p className="text-gray-600 text-sm">Regular Price:</p>
                        <p className="text-2xl font-bold line-through text-gray-500">Rs. {selectedProduct.discountPrice.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-gray-600 text-sm font-semibold">Sale Price:</p>
                        <p className="text-3xl font-bold text-green-600">Rs. {selectedProduct.price.toLocaleString()}</p>
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {Math.round(((selectedProduct.discountPrice - selectedProduct.price) / selectedProduct.discountPrice) * 100)}% OFF
                        </span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold mb-2">Price</p>
                      <p className="text-3xl font-bold text-orange-500">Rs. {selectedProduct.price.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900">Description</h3>
                <div className="space-y-3">
                  <p className="text-slate-700">{selectedProduct.shortDescription}</p>
                  {selectedProduct.longDescription && (
                    <p className="text-slate-600">{selectedProduct.longDescription}</p>
                  )}
                </div>
              </div>

              {/* Features */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Key Features</h3>
                  <ul className="space-y-2">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-orange-500 font-bold text-lg">✓</span>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-4 text-slate-900">Specifications</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {selectedProduct.specifications.map((spec, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 font-semibold text-slate-900 w-1/3">{spec.key}</td>
                            <td className="px-4 py-3 text-slate-700">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Rating & Reviews */}
              <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900">Customer Rating</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Average Rating</p>
                      <p className="font-bold text-2xl flex items-center gap-2">
                        {'⭐'.repeat(Math.floor(selectedProduct.rating))} {selectedProduct.rating}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Customer Reviews</p>
                      <p className="font-bold text-2xl">{selectedProduct.reviews} reviews</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Product ID</p>
                      <p className="font-bold text-lg">#{selectedProduct.id}</p>
                    </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 flex gap-3">
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    selectedProduct.stock > 0
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {selectedProduct.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
                <Link
                  href="/checkout"
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition text-center"
                >
                  🛍️ Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
