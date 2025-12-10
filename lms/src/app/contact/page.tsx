"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call - in a real app, this would be an actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form on successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      setSubmitStatus({
        success: true,
        message: "Thank you for your message! We'll get back to you soon."
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "There was an error submitting your form. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffe9d6] bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_55%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_60%)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="mb-4 inline-block rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
              Get in touch
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Contact <span className="text-orange-500">Us</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Have questions about our courses, need technical support, or want to provide feedback?
              We're here to help!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 rounded-3xl border border-orange-100 p-8 shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Send Us a Message
              </h2>

              {submitStatus && (
                <div className={`mb-6 p-4 rounded-xl ${
                  submitStatus.success
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-800 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl border-2 border-orange-100 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl border-2 border-orange-100 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-800 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full h-12 rounded-xl border-2 border-orange-100 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all"
                    placeholder="Course inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-800 mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-xl border-2 border-orange-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white text-slate-900 transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/60 transition hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 md:py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center p-6 rounded-2xl bg-white border border-orange-100 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white text-xl shadow-md mb-4">
                  📧
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Email Support</h3>
                <p className="text-sm text-slate-600 mb-4">
                  For general inquiries and support
                </p>
                <Link
                  href="mailto:support@learningplatform.com"
                  className="text-sm font-semibold text-orange-500 hover:text-orange-600"
                >
                  support@learningplatform.com
                </Link>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border border-orange-100 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white text-xl shadow-md mb-4">
                  📞
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Phone Support</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Available Mon-Fri, 9AM-5PM
                </p>
                <p className="text-sm font-semibold text-orange-500">
                  +1 (555) 123-4567
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl bg-white border border-orange-100 shadow-sm">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white text-xl shadow-md mb-4">
                  🏢
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Office Address</h3>
                <p className="text-sm text-slate-600">
                  123 Education Street<br />
                  Learning City, LC 12345<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}