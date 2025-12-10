// src/app/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import heroImage from "@/upload/hero-image.jpg";
import PreFooter from "@/components/PreFooter";
import AnnouncementsSection from "@/components/AnnouncementsSection";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
  createdBy: { firstName: string; lastName: string };
}

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Use Next.js rewrite system for API calls
  // Next.js will proxy /api/* requests to the backend automatically
  const API_ENDPOINT = '/api/announcements';

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        console.log(`Attempting to fetch announcements from: ${API_ENDPOINT}`);

        // Enhanced fetch with better error handling and timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          signal: controller.signal,
          mode: 'cors', // Explicitly set CORS mode
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }

        const data = await response.json();
        console.log('Announcements fetched successfully:', data.announcements);

        // Validate response structure
        if (!data || !Array.isArray(data.announcements)) {
          throw new Error('Invalid response format: expected announcements array');
        }

        setAnnouncements(data.announcements || []);
      } catch (error: any) {
        console.error("Failed to fetch announcements:", error);

        // More specific error messages
        if (error.name === 'AbortError') {
          setFetchError('Request timed out. Please check your network connection.');
        } else if (error.message.includes('Failed to fetch')) {
          setFetchError('Network error: Unable to connect to the server. Please check if the backend is running.');
        } else if (error.message.includes('HTTP error')) {
          setFetchError(error.message);
        } else {
          setFetchError(`Failed to fetch announcements: ${error.message}`);
        }

        // Set some dummy data for development
        if (process.env.NODE_ENV === 'development') {
          setAnnouncements([
            {
              _id: 'dev-1',
              title: 'Development Mode',
              message: 'Using dummy announcements since the API is not available.',
              type: 'info',
              createdAt: new Date().toISOString(),
              createdBy: { firstName: 'System', lastName: 'Admin' }
            }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch on client side
    if (typeof window !== 'undefined') {
      fetchAnnouncements();
    }
  }, [API_ENDPOINT]);
  return (
    <>
      {/* Hero - warm MKS style */}
      <section className="relative overflow-hidden bg-[#ffe9d6]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_55%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-8 md:py-10">

          <div className="mt-12 flex flex-col items-center justify-between gap-12 md:flex-row md:gap-16">
            {/* Left content */}
            <div className="max-w-xl">
              <p className="mb-4 inline-block rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                Online education platform
              </p>
              <h1 className="mb-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-[3.3rem]">
                A Classical Education for the{" "}
                <span className="relative inline-block text-orange-500">
                  Future
                  <span className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-orange-400" />
                </span>
              </h1>
              <p className="mb-8 text-base text-slate-700 md:text-lg">
                We prepare you to engage in the world that is and to help bring about
                a world that ought to be, through flexible, high‑quality online learning.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/register"
                  className="rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/60 transition hover:bg-orange-600"
                >
                  Get started
                </Link>
                <Link
                  href="/courses"
                  className="rounded-full border border-orange-300 bg-white/70 px-7 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Browse courses
                </Link>
                <Link
                  href="/shop"
                  className="rounded-full border border-pink-300 bg-white/70 px-7 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
                >
                  9Tangle Store
                </Link>
              </div>
            </div>

            {/* Right visual panel */}
            <div className="relative flex w-full max-w-md items-center justify-center md:max-w-lg">
              <div className="relative w-full overflow-hidden rounded-[3rem] bg-[#ffd3aa] p-4 shadow-2xl">
                <div className="flex h-full items-center justify-center rounded-[2.5rem] bg-gradient-to-t from-orange-100 via-amber-50 to-white">
                  {/* Hero image */}
                  <div className="flex h-56 w-full flex-col items-center justify-center gap-3 text-center text-sm text-orange-500">
                    <span className="rounded-[2rem] bg-white overflow-hidden shadow-lg w-full h-lg">
                      <Image
                        src={heroImage}
                        alt="Hero Image"
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights - Live Chat / Examination / Competition */}
      <section className="relative -mt-10 md:-mt-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "💬",
                title: "Live Chat",
                desc: "Instantly connect with instructors and peers for quick help.",
              },
              {
                icon: "📝",
                title: "Examination",
                desc: "Structured assessments to track and certify your progress.",
              },
              {
                icon: "🏅",
                title: "Competition",
                desc: "Engage in challenges and contests to sharpen your skills.",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-white shadow-sm p-6 hover:shadow-xl transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white text-xl shadow-md">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{f.title}</h3>
                    <p className="text-sm text-slate-600">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <AnnouncementsSection
        announcements={announcements}
        fetchError={fetchError}
        isLoading={isLoading}
      />

      {/* New Image Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">

        </div>
      </section>


      {/* Explore Our Popular Course */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400 mb-2">
                Courses
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Explore Our{" "}
                <span className="text-orange-500">Popular Course</span>
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600">
              <span className="text-xs">▼</span>
              Sort by
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Learn Marketing From Top Instructors.",
                img: "/images/courses/marketing.jpg",
              },
              {
                title: "Front-End Development Is Not Hard As You Think",
                img: "/images/courses/frontend.jpg",
              },
              {
                title: "Everything You Need To Know In UX",
                img: "/images/courses/ux.jpg",
              },
              {
                title: "Learn Photography With Ease",
                img: "/images/courses/photography.jpg",
              },
              {
                title: "Be A Pro In Data Analysis",
                img: "/images/courses/data.jpg",
              },
              {
                title: "Ethical Hacking Is Not Hard As You Think",
                img: "/images/courses/hacking.jpg",
              },
            ].map((course) => (
              <div
                key={course.title}
                className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="h-44 w-full bg-gray-200">
                  {/* Replace with next/image and real images when available */}
                </div>
                <div className="p-5 space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>6 weeks</span>
                      <span className="flex items-center gap-1">
                        <span>👤</span> 1.5k Students
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 font-semibold">
                      <span className="text-xs text-gray-500 mr-1">☆ 4.5</span>
                      <span>30.5$</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Footer Section */}
      <PreFooter />

    </>
  );
}
