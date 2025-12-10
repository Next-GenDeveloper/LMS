"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  createdBy: { firstName: string; lastName: string };
}

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  fetchError: string | null;
  isLoading: boolean;
}

export default function AnnouncementsSection({
  announcements,
  fetchError,
  isLoading
}: AnnouncementsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Auto-scroll through announcements
  useEffect(() => {
    if (announcements.length > 1 && isAutoScrolling) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % announcements.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [announcements.length, isAutoScrolling]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-600',
          icon: '🎉',
          gradient: 'from-green-100 to-green-50'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-600',
          icon: '⚠️',
          gradient: 'from-yellow-100 to-yellow-50'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-600',
          icon: '❌',
          gradient: 'from-red-100 to-red-50'
        };
      default: // info
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-600',
          icon: 'ℹ️',
          gradient: 'from-blue-100 to-blue-50'
        };
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-orange-500 font-medium"
          >
            <span className="animate-spin">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            Loading announcements...
          </motion.div>
        </div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl border-l-4 border-red-400 p-6 max-w-4xl mx-auto shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Announcement Service Unavailable</h3>
                <p className="text-gray-600 mb-2">
                  {fetchError}
                </p>
                <p className="text-sm text-gray-500">
                  We're working to restore this service. Please check back later.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl border border-blue-200 p-8 max-w-4xl mx-auto shadow-lg text-center"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4 mx-auto">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Announcements Available</h3>
            <p className="text-gray-600 mb-4">
              Check back later for important updates and news.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500 mb-3 inline-block"
          >
            Latest Updates
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900"
          >
            Important Announcements
          </motion.h2>
        </div>

        {/* Announcements Carousel */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              {announcements.map((announcement, index) => (
                index === activeIndex && (
                  <motion.div
                    key={announcement._id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
                  >
                    {/* Announcement Header with Gradient */}
                    <div className={`px-8 py-6 bg-gradient-to-r ${getTypeStyles(announcement.type).gradient}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-2xl shadow-sm">
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
                              month: 'short',
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
                            month: 'short',
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
            {announcements.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => {
                    setActiveIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
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
                  {announcements.map((_, index) => (
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
                    setActiveIndex((prev) => (prev + 1) % announcements.length);
                    setIsAutoScrolling(false);
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}