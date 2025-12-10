"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: string;
  createdBy: { firstName: string; lastName: string };
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'info' | 'warning' | 'success' | 'error'>('all');

  // Fetch announcements data
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Use Next.js API route
        const response = await fetch('/api/announcements', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.announcements)) {
          throw new Error('Invalid response format');
        }

        setAnnouncements(data.announcements || []);
      } catch (error: any) {
        console.error("Failed to fetch announcements:", error);
        setFetchError(error.message);

        // Set dummy data for development
        if (process.env.NODE_ENV === 'development') {
          setAnnouncements([
            {
              _id: 'dev-1',
              title: 'New Course Launch: Advanced Web Development',
              message: 'We are excited to announce our new Advanced Web Development course starting next month. This comprehensive program covers modern JavaScript frameworks, advanced CSS techniques, and backend integration. Enrollment opens on January 15th!',
              type: 'success',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              createdBy: { firstName: 'Sarah', lastName: 'Johnson' }
            },
            {
              _id: 'dev-2',
              title: 'Platform Maintenance Scheduled',
              message: 'Please note that our platform will undergo scheduled maintenance on December 20th from 2:00 AM to 4:00 AM UTC. During this time, you may experience temporary downtime. We apologize for any inconvenience and appreciate your patience.',
              type: 'warning',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              createdBy: { firstName: 'Michael', lastName: 'Chen' }
            },
            {
              _id: 'dev-3',
              title: 'Holiday Learning Challenge',
              message: 'Join our Holiday Learning Challenge! Complete 5 courses between December 1st and January 15th to earn exclusive badges and a chance to win amazing prizes including free course enrollments and premium subscriptions. Start your learning journey today!',
              type: 'info',
              createdAt: new Date(Date.now() - 259200000).toISOString(),
              createdBy: { firstName: 'Emily', lastName: 'Wilson' }
            },
            {
              _id: 'dev-4',
              title: 'Important Security Update',
              message: 'We have implemented enhanced security measures to protect your account and data. All users are required to update their passwords by December 31st. Please visit your account settings to complete this important security update.',
              type: 'error',
              createdAt: new Date(Date.now() - 345600000).toISOString(),
              createdBy: { firstName: 'David', lastName: 'Martinez' }
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Auto-scroll through announcements
  useEffect(() => {
    if (filteredAnnouncements.length > 1 && isAutoScrolling) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % filteredAnnouncements.length);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [filteredAnnouncements.length, isAutoScrolling]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          icon: '🎉',
          gradient: 'from-green-100 to-green-50',
          accent: 'bg-green-500',
          ring: 'ring-green-200'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-600',
          icon: '⚠️',
          gradient: 'from-yellow-100 to-yellow-50',
          accent: 'bg-yellow-500',
          ring: 'ring-yellow-200'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          icon: '❌',
          gradient: 'from-red-100 to-red-50',
          accent: 'bg-red-500',
          ring: 'ring-red-200'
        };
      default: // info
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          icon: 'ℹ️',
          gradient: 'from-blue-100 to-blue-50',
          accent: 'bg-blue-500',
          ring: 'ring-blue-200'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center h-64">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 text-orange-500 font-medium"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-6 w-6"
              >
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </motion.div>
              <span className="text-lg">Loading announcements...</span>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl border-l-4 border-red-400 p-8 max-w-4xl mx-auto shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Announcement Service Unavailable</h3>
                <p className="text-gray-600 mb-4">
                  {fetchError}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  We're working to restore this service. Please check back later.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry Connection
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (filteredAnnouncements.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl border border-blue-200 p-10 max-w-4xl mx-auto shadow-lg text-center"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6 mx-auto">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Announcements Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Check back later for important updates and news. You can also explore our courses while you wait.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Announcements
              </button>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2 border border-blue-300 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
                </svg>
                Browse Courses
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_60%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_70%)]" />
        </div>
        <div className="relative container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500 mb-4 inline-block"
            >
              Stay Informed
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6"
            >
              Important Announcements & Updates
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-slate-700 max-w-3xl mx-auto mb-8"
            >
              Stay up-to-date with the latest news, platform updates, and important information from our learning community.
            </motion.p>

            {/* Filter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3 mb-12"
            >
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-orange-500 hover:bg-orange-50'}`}
              >
                All Announcements
              </button>
              <button
                onClick={() => setFilterType('info')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'info' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-blue-500 hover:bg-blue-50'}`}
              >
                Information
              </button>
              <button
                onClick={() => setFilterType('success')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'success' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-green-500 hover:bg-green-50'}`}
              >
                Success Stories
              </button>
              <button
                onClick={() => setFilterType('warning')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'warning' ? 'bg-yellow-500 text-white shadow-lg' : 'bg-white text-yellow-500 hover:bg-yellow-50'}`}
              >
                Important Notes
              </button>
              <button
                onClick={() => setFilterType('error')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterType === 'error' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-red-500 hover:bg-red-50'}`}
              >
                Urgent Alerts
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <AnimatePresence mode="wait">
                {filteredAnnouncements.map((announcement, index) => (
                  index === activeIndex && (
                    <motion.div
                      key={announcement._id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden mb-12"
                    >
                      {/* Announcement Header with Gradient */}
                      <div className={`px-8 py-6 bg-gradient-to-r ${getTypeStyles(announcement.type).gradient}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-2xl shadow-sm ring-2 ring-white">
                              {getTypeStyles(announcement.type).icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{announcement.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Posted by {announcement.createdBy.firstName} {announcement.createdBy.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                              {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeStyles(announcement.type).bg} ${getTypeStyles(announcement.type).text}`}>
                              {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Announcement Content */}
                      <div className="px-8 py-8">
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="text-gray-700 leading-relaxed text-lg mb-6"
                        >
                          {announcement.message}
                        </motion.p>

                        {/* Mobile date display */}
                        <div className="md:hidden flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeStyles(announcement.type).bg} ${getTypeStyles(announcement.type).text}`}>
                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>

              {/* Navigation Controls */}
              {filteredAnnouncements.length > 1 && (
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setActiveIndex((prev) => (prev - 1 + filteredAnnouncements.length) % filteredAnnouncements.length);
                        setIsAutoScrolling(false);
                      }}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Indicator Dots */}
                    <div className="flex gap-2">
                      {filteredAnnouncements.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveIndex(index);
                            setIsAutoScrolling(false);
                          }}
                          className={`h-2 w-2 rounded-full transition-colors ${index === activeIndex ? 'bg-orange-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setActiveIndex((prev) => (prev + 1) % filteredAnnouncements.length);
                        setIsAutoScrolling(false);
                      }}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                    >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {isAutoScrolling ? (
                      <>
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pause Auto-Scroll
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Resume Auto-Scroll
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Announcement List View */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">All Announcements</h2>
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <motion.div
                    key={announcement._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ translateX: 5 }}
                    className={`p-5 rounded-xl border-l-4 ${getTypeStyles(announcement.type).border} bg-white shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-lg">
                        {getTypeStyles(announcement.type).icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-slate-900">{announcement.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getTypeStyles(announcement.type).bg} ${getTypeStyles(announcement.type).text}`}>
                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2 line-clamp-2">{announcement.message}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>
                            Posted by {announcement.createdBy.firstName} {announcement.createdBy.lastName}
                          </span>
                          <span>
                            {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }} />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
                    📢
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">Stay Connected</h2>
                </div>
                <p className="text-lg mb-6 max-w-2xl">
                  Never miss important updates! Bookmark this page and check back regularly for the latest announcements, platform improvements, and learning opportunities.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-orange-100 transition-colors"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Go to Dashboard
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                  >
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" />
                    </svg>
                    Explore Courses
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}