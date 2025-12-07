// src/app/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import heroImage from "@/upload/hero-image.jpg";
import PreFooter from "@/components/PreFooter";

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

  useEffect(() => {
    fetch("http://localhost:5000/api/announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements || []))
      .catch(err => console.error("Failed to fetch announcements", err));
  }, []);
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
      {announcements.length > 0 && (
        <section className="py-10 bg-amber-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400 mb-2">
                Announcements
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Latest Updates
              </h2>
            </div>
            <div className="space-y-4 max-w-4xl mx-auto">
              {announcements.map((ann) => (
                <div key={ann._id} className="bg-white rounded-lg border border-orange-100 p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      ann.type === 'info' ? 'bg-blue-500' :
                      ann.type === 'warning' ? 'bg-yellow-500' :
                      ann.type === 'success' ? 'bg-green-500' :
                      'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">{ann.title}</h3>
                      <p className="text-slate-600 mb-3">{ann.message}</p>
                      <div className="text-xs text-slate-500">
                        By {ann.createdBy.firstName} {ann.createdBy.lastName} • {new Date(ann.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
