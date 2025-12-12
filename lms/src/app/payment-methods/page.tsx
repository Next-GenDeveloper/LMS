"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

export default function PaymentMethodsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const courseIdParam = searchParams.get('courseId');
    const titleParam = searchParams.get('title');
    const priceParam = searchParams.get('price');

    if (courseIdParam) {
      setCourseId(courseIdParam);
    }
    if (titleParam) {
      setCourseTitle(titleParam);
    }
    if (priceParam) {
      setCoursePrice(parseFloat(priceParam) || 0);
    }

    setLoading(false);
  }, [searchParams]);

  const handlePaymentMethodSelect = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    if (!courseId) {
      setError("Course ID is missing");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push(`/auth/login?next=/payment-methods?courseId=${courseId}`);
        return;
      }

      // Process enrollment with selected payment method
      const response = await fetch(`${API_BASE}/api/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          courseId: courseId, 
          paymentMethod: paymentMethod
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Enrollment failed");
      }

      const result = await response.json();
      
      // Show success message and redirect to course
      alert(result.message || "Enrollment successful! You can now access the course.");
      router.push(`/courses/${courseId}`);

    } catch (err) {
      console.error("Enrollment error:", err);
      setError(err instanceof Error ? err.message : "Enrollment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-4 text-gray-700">Loading payment options...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span>•</span>
          <Link href="/courses" className="hover:text-orange-500">Courses</Link>
          <span>•</span>
          <span className="text-orange-500 font-semibold">Payment Methods</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Complete Your Enrollment</h1>
              <p className="text-orange-100">Choose your preferred payment method to enroll in {courseTitle}</p>
            </div>

            {/* Course Info */}
            <div className="p-6 border-b border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{courseTitle}</h2>
                  <p className="text-slate-600 text-sm">Course ID: {courseId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Amount to pay</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                    Rs. {coursePrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Select Payment Method</h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Easypaisa Payment Method */}
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'easypaisa' ? 'border-orange-500 bg-orange-50' : 'border-orange-100 hover:border-orange-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={() => setPaymentMethod('easypaisa')}
                    className="mr-3 h-5 w-5 text-orange-500 focus:ring-orange-400"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">EP</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Easypaisa</p>
                        <p className="text-sm text-slate-600">Mobile Wallet Payment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">No fees</p>
                      <p className="text-sm text-slate-500">Instant</p>
                    </div>
                  </div>
                </label>

                {/* Bank Transfer Payment Method */}
                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-orange-500 bg-orange-50' : 'border-orange-100 hover:border-orange-300'}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mr-3 h-5 w-5 text-orange-500 focus:ring-orange-400"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">🏦</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Bank Transfer</p>
                        <p className="text-sm text-slate-600">Direct Bank Payment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Processing time: 1-2 days</p>
                    </div>
                  </div>
                </label>

                {/* Credit Card Payment Method (Disabled) */}
                <label className="flex items-center p-4 border-2 rounded-xl cursor-not-allowed opacity-60" title="Coming soon">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    disabled
                    className="mr-3 h-5 w-5 text-orange-500 focus:ring-orange-400 cursor-not-allowed"
                  />
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">💳</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Credit/Debit Card</p>
                        <p className="text-sm text-slate-600">Visa, Mastercard</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Coming Soon</span>
                    </div>
                  </div>
                </label>

                {/* Payment Instructions for Bank Transfer */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-3">Bank Transfer Instructions</h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p><strong>Bank Name:</strong> Standard Chartered Bank</p>
                      <p><strong>Account Name:</strong> 9Tangle Learning Platform</p>
                      <p><strong>Account Number:</strong> 123-456-789012</p>
                      <p><strong>Branch Code:</strong> 0123</p>
                      <p><strong>Reference:</strong> Your Name - Course {courseId}</p>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      After transferring, please email your receipt to payments@9tangle.com with your course details.
                    </p>
                  </div>
                )}

                {/* Payment Instructions for Easypaisa */}
                {paymentMethod === 'easypaisa' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-3">Easypaisa Payment Instructions</h4>
                    <div className="space-y-2 text-sm text-slate-700">
                      <p><strong>Easypaisa Account:</strong> 0300-1234567</p>
                      <p><strong>Account Name:</strong> 9Tangle Learning</p>
                      <p><strong>Amount:</strong> Rs. {coursePrice.toLocaleString()}</p>
                      <p><strong>Reference:</strong> Course {courseId}</p>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      After payment, you will receive a confirmation SMS. Your enrollment will be processed automatically.
                    </p>
                  </div>
                )}

                {/* Complete Payment Button */}
                <div className="mt-8 pt-6 border-t border-orange-100">
                  <button
                    onClick={handlePaymentMethodSelect}
                    disabled={isProcessing || !paymentMethod}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all ${
                      isProcessing || !paymentMethod
                        ? 'bg-orange-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        Processing Payment...
                      </>
                    ) : (
                      'Complete Payment & Enroll'
                    )}
                  </button>

                  <div className="mt-4 text-center">
                    <Link 
                      href={`/courses/${courseId}`}
                      className="text-sm text-orange-500 hover:text-orange-600 font-semibold"
                    >
                      ← Back to Course
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}