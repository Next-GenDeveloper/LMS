'use client';

import { useState } from 'react';

interface ProductFormData {
  name: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[];
  specifications: { key: string; value: string }[];
  features: string[];
}

interface ProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: any) => void;
}

const EMOJI_ICONS = [
  '💻', '📱', '⌨️', '🖱️', '🎧', '📷', '⌚', '🎮',
  '📚', '✏️', '🎨', '🔧', '⚡', '🔋', '📦', '🛍️',
];

export default function ProductUploadModal({
  isOpen,
  onClose,
  onProductAdded,
}: ProductUploadModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'Electronics',
    shortDescription: '',
    longDescription: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    images: Array(6).fill(''),
    specifications: [{ key: '', value: '' }],
    features: [''],
  });

  const [selectedImageIndices, setSelectedImageIndices] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageSelect = (index: number) => {
    if (selectedImageIndices.includes(index)) {
      setSelectedImageIndices(selectedImageIndices.filter(i => i !== index));
    } else {
      setSelectedImageIndices([...selectedImageIndices, index]);
    }
  };

  const handleImageChange = (index: number, emoji: string) => {
    const newImages = [...formData.images];
    newImages[index] = emoji;
    setFormData(prev => ({
      ...prev,
      images: newImages,
    }));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs,
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }],
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.shortDescription || formData.price <= 0) {
      alert('Please fill in required fields');
      return;
    }

    if (formData.images.filter(img => img).length === 0) {
      alert('Please select at least one image');
      return;
    }

    setIsSubmitting(true);

    // Simulate upload delay
    setTimeout(() => {
      const filteredImages = formData.images.filter(img => img);
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        image: filteredImages.length > 0 ? filteredImages[0] : '📦', // Set first image as main image
        images: filteredImages,
        specifications: formData.specifications.filter(s => s.key && s.value),
        features: formData.features.filter(f => f),
        rating: 4.5,
        reviews: 12,
        createdAt: new Date().toISOString(),
      };

      onProductAdded(newProduct);
      setIsSubmitting(false);
      onClose();

      // Reset form
      setFormData({
        name: '',
        category: 'Electronics',
        shortDescription: '',
        longDescription: '',
        price: 0,
        discountPrice: 0,
        stock: 0,
        images: Array(6).fill(''),
        specifications: [{ key: '', value: '' }],
        features: [''],
      });
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center z-10">
            <h2 className="text-3xl font-bold">📤 Add New Product</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-8">
            {/* Basic Information */}
            <section>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Premium Wireless Headphones"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Electronics</option>
                      <option>Accessories</option>
                      <option>Books</option>
                      <option>Fashion</option>
                      <option>Home & Garden</option>
                      <option>Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    placeholder="Brief description shown in product listing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) => handleInputChange('longDescription', e.target.value)}
                    placeholder="Comprehensive product description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Regular Price (PKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="9999"
                    step="1"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Discount Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.discountPrice}
                    onChange={(e) => handleInputChange('discountPrice', parseFloat(e.target.value) || 0)}
                    placeholder="7999"
                    step="1"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* Product Images */}
            <section>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Product Images (Up to 6)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {formData.images.map((image, idx) => (
                  <div
                    key={idx}
                    className="relative border-2 rounded-lg overflow-hidden transition hover:border-blue-500 bg-gray-50"
                  >
                    {image ? (
                      <div className="relative aspect-square">
                        <img 
                          src={image} 
                          alt={`Product ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleImageChange(idx, '')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Check file size
                              if (file.size > 2 * 1024 * 1024) {
                                alert('Image size should be less than 2MB. Please use a smaller image.');
                                return;
                              }
                              
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const img = new Image();
                                img.onload = () => {
                                  // Create canvas to resize image
                                  const canvas = document.createElement('canvas');
                                  const ctx = canvas.getContext('2d');
                                  
                                  // Resize to max 800x800 while maintaining aspect ratio
                                  let width = img.width;
                                  let height = img.height;
                                  const maxSize = 800;
                                  
                                  if (width > height && width > maxSize) {
                                    height = (height * maxSize) / width;
                                    width = maxSize;
                                  } else if (height > maxSize) {
                                    width = (width * maxSize) / height;
                                    height = maxSize;
                                  }
                                  
                                  canvas.width = width;
                                  canvas.height = height;
                                  ctx?.drawImage(img, 0, 0, width, height);
                                  
                                  // Convert to compressed JPEG
                                  const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
                                  handleImageChange(idx, compressedImage);
                                };
                                img.src = reader.result as string;
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <div className="text-4xl text-gray-400 mb-2">📷</div>
                        <p className="text-xs text-gray-600 font-semibold">Upload Image</p>
                        <p className="text-xs text-gray-500 mt-1">Max 2MB</p>
                      </label>
                    )}
                    <p className="text-xs text-gray-600 text-center py-2 bg-white">Image {idx + 1}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                💡 Click on any image slot to upload. Supported formats: JPG, PNG, GIF, WebP
              </p>
            </section>

            {/* Specifications */}
            <section>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Specifications</h3>
              <div className="space-y-3 mb-3">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(idx, 'key', e.target.value)}
                      placeholder="e.g., Color"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(idx, 'value', e.target.value)}
                      placeholder="e.g., Black"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeSpecification(idx)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addSpecification}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
              >
                + Add Specification
              </button>
            </section>

            {/* Features */}
            <section>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Key Features</h3>
              <div className="space-y-3 mb-3">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      placeholder="e.g., High-quality audio"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeFeature(idx)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-sm"
              >
                + Add Feature
              </button>
            </section>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Publishing...
                  </>
                ) : (
                  '✓ Publish Product'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
