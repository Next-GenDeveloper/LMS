"use client";
import { useEffect, useState, use } from "react";
import StarRating from "@/components/StarRating";
import { API_BASE } from "@/lib/api";

type Lesson = {
  title: string;
  duration: string;
  preview: boolean;
};

type CurriculumSection = {
  title: string;
  lessons: Lesson[];
};

type Review = {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
};

type Course = {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    courses: number;
    students: number;
    rating: number;
  };
  rating: number;
  reviews: number | Review[];
  students: number;
  price: number;
  originalPrice: number;
  duration: string;
  lessons: number;
  level: string;
  language: string;
  lastUpdated: string;
  certificate: boolean;
  whatYouLearn: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
};

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/courses/${id}/details`);
        if (!response.ok) {
          throw new Error(`Failed to fetch course details: ${response.status}`);
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const totalLessons =
    course?.curriculum?.reduce((acc, section) => acc + section.lessons.length, 0) || 0;

  const totalDuration =
    course?.curriculum?.reduce((acc, section) => {
      return (
        acc +
        section.lessons.reduce((lessonAcc, lesson) => {
          const [mins] = lesson.duration.split(":").map(Number);
          return lessonAcc + mins;
        }, 0)
      );
    }, 0) || 0;

  const strategyHighlights = [
    { title: "Headline Formulas", copy: "Proprietary hooks that stop scrolling buyers on eBay." },
    { title: "Conversion Copy", copy: "Psychology-backed scripts aligned with premium positioning." },
    { title: "Pricing Architecture", copy: "Dynamic tiered pricing to keep you competitive and profitable." },
    { title: "Visual Systems", copy: "Cohesive imagery, mockups, and templates that look curated." },
  ];

  const consultingServices = [
    { title: "Launch & Scale Plan", detail: "90-day roadmaps with benchmarking and KPI sprints." },
    { title: "Creative Direction", detail: "Story-driven storefront refreshes and curated imagery." },
    { title: "High-Ticket Coaching", detail: "Weekly office hours, KPI reviews, and positioning feedback." },
  ];

  const testimonialList = Array.isArray(course?.reviews) ? course.reviews : [];

  const handleEnroll = async () => {
    if (!course) {
      alert("Course not found");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = `/auth/login?next=${encodeURIComponent(`/courses/${id}`)}`;
      return;
    }

    try {
      const checkResponse = await fetch(`${API_BASE}/api/enrollments/check/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (checkResponse.ok) {
        const { isEnrolled } = await checkResponse.json();
        if (isEnrolled) {
          alert("You already have access to this training.");
          return;
        }
      }

      window.location.href = `/payment-methods?courseId=${id}&title=${encodeURIComponent(
        course.title
      )}&price=${course.price}`;
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(`Enrollment failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-yellow-400" />
        <p className="ml-4 text-gray-200">Loading premium insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-100 mb-3">Data unavailable</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-yellow-500 text-blue-950 rounded-full font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center">
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-100 mb-3">Program not found</h2>
          <p className="text-gray-300 mb-6">The offering you requested is unavailable right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-blue-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 opacity-95" />
        <div className="absolute -top-24 right-10 h-72 w-72 rounded-full bg-yellow-400/30 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10 py-20">
          <div className="max-w-4xl space-y-6">
            <p className="text-xs uppercase tracking-[0.5em] text-yellow-300">9tangle</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl">{course.description}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleEnroll}
                className="px-8 py-3 rounded-full bg-yellow-400 text-blue-950 font-semibold transition hover:scale-[1.02]"
              >
                Secure enrollment
              </button>
              <a
                href="#consultancy"
                className="px-8 py-3 rounded-full border border-white/40 text-white font-semibold"
              >
                Book consultancy
              </a>
            </div>
            <div className="flex gap-10 text-sm text-gray-200">
              <div>
                <p className="text-3xl font-semibold">{course.students.toLocaleString()}</p>
                <p className="text-gray-400">Learners guided</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{course.rating.toFixed(1)}</p>
                <p className="text-gray-400">Average rating</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">{Math.floor(totalDuration / 60)}h</p>
                <p className="text-gray-400">Strategy time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-16 space-y-20">
          <section id="training" className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-yellow-500">Training Path</p>
              <h2 className="text-3xl font-semibold">Course Selling & eBay Mastery</h2>
              <p className="text-gray-600">
                9tangle combines consultancy with immersive training so you can launch listings, sell courses, and build recurring revenue on eBay.
              </p>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {course.whatYouLearn.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 p-5 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm transition hover:-translate-y-1"
                  >
                    <span className="text-xs uppercase tracking-[0.3em] text-yellow-600">Module</span>
                    <h3 className="text-base font-semibold text-blue-950">{item}</h3>
                    <p className="text-sm text-gray-600">Actionable tactics for listing and selling online courses.</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 bg-gradient-to-b from-blue-900 to-blue-800 text-white rounded-2xl shadow-lg">
                  <p className="text-3xl font-semibold">{course.curriculum.length}</p>
                  <p className="text-sm text-gray-300">Workshops</p>
                </div>
                <div className="p-4 bg-gradient-to-b from-blue-900 to-blue-800 text-white rounded-2xl shadow-lg">
                  <p className="text-3xl font-semibold">{totalLessons}</p>
                  <p className="text-sm text-gray-300">Lessons</p>
                </div>
                <div className="p-4 bg-gradient-to-b from-blue-900 to-blue-800 text-white rounded-2xl shadow-lg">
                  <p className="text-3xl font-semibold">{course.duration}</p>
                  <p className="text-sm text-gray-300">Program</p>
                </div>
              </div>
            </div>
          </section>

          <section id="listing" className="space-y-8">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.4em] text-gray-500">Product Listing Strategies</p>
              <h2 className="text-3xl font-semibold text-blue-950">Craft listings that convert</h2>
              <p className="text-gray-600 max-w-3xl">
                We walk through every detail—from copy to visuals—so your eBay catalog looks premium, tells a story, and drives buyers to checkout.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {strategyHighlights.map((strategy) => (
                <div
                  key={strategy.title}
                  className="p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm hover:border-yellow-400 transition"
                >
                  <div className="text-yellow-600 text-2xl">•</div>
                  <h3 className="text-xl font-semibold text-blue-950 mt-2">{strategy.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{strategy.copy}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="consultancy" className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.4em] text-yellow-500">Consultancy Services</p>
              <h2 className="text-3xl font-semibold text-blue-950">Strategic partnership, not just training</h2>
              <p className="text-gray-600">
                We map your goals, audit your eBay presence, and help you position your digital products in the most compelling, business-friendly way.
              </p>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {consultingServices.map((service) => (
                <div
                  key={service.title}
                  className="p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-blue-950">{service.title}</h3>
                  <p className="text-gray-600 mt-2">{service.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.4em] text-yellow-500">Results</p>
              <h2 className="text-3xl font-semibold text-blue-950">Designed for eBay pros</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm">
                <p className="text-3xl font-semibold text-yellow-600">{course.students.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Sellers onboarded</p>
              </div>
              <div className="p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm">
                <p className="text-3xl font-semibold text-yellow-600">{Math.round(course.rating * 20)}%</p>
                <p className="text-sm text-gray-600">Avg. sales lift</p>
              </div>
              <div className="p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm">
                <p className="text-3xl font-semibold text-yellow-600">{Math.floor(totalDuration / 10)}+</p>
                <p className="text-sm text-gray-600">Hours of strategy time</p>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.4em] text-yellow-500">Testimonials</p>
              <h2 className="text-3xl font-semibold text-blue-950">What premium sellers say</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {testimonialList.slice(0, 3).map((review, idx) => (
                <div
                  key={`${review.name}-${idx}`}
                  className="p-6 bg-gray-100 border border-gray-200 rounded-2xl shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-950">{review.name}</h3>
                    <StarRating value={review.rating} />
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{review.text}</p>
                  <p className="text-xs text-gray-500 mt-4">{review.date}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-950 text-white rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-blue-900 to-blue-900 opacity-90" />
            <div className="relative space-y-6 max-w-3xl">
              <p className="text-sm uppercase tracking-[0.4em] text-yellow-200">Pricing</p>
              <h2 className="text-4xl font-semibold">Enroll in the 9tangle eBay Consultant Program</h2>
              <p className="text-gray-200">
                Premium coaching, onboarding playbooks, and a dedicated consultant to help you sell courses and digital products with confidence on eBay.
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-5xl font-bold">${course.price}</span>
                  <p className="text-gray-400 text-sm line-through">${course.originalPrice}</p>
                </div>
                <button
                  onClick={handleEnroll}
                  className="px-8 py-3 rounded-full bg-white text-blue-950 font-semibold hover:scale-[1.01] transition"
                >
                  Secure Your Seat
                </button>
              </div>
              <p className="text-sm text-gray-200">Includes lifetime access, community previews, and one live strategy session.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
