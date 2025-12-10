
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import LiveChat from "@/components/LiveChat";
import StructuredExamination from "@/components/StructuredExamination";
import CompetitiveChallenges from "@/components/CompetitiveChallenges";

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "reviews">("overview");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Transform the data to match our expected structure
          const transformedCourse = {
            id: data.id,
            title: data.title,
            description: data.description,
            price: data.price,
            originalPrice: data.price * 2, // Simple way to show discount
            bannerImage: data.bannerImage || "/next.svg",
            rating: data.rating || 4.5,
            reviews: data.reviews || 100,
            students: data.enrollmentCount || 500,
            duration: `${data.duration || 8} hours`,
    ],
    curriculum: [
      {
        title: "Getting Started with React",
        lessons: [
          { title: "Introduction to React", duration: "10:30", preview: true },
          { title: "Setting Up Development Environment", duration: "15:00", preview: true },
          { title: "Your First React Component", duration: "20:00", preview: false },
          { title: "Understanding JSX", duration: "18:00", preview: false },
        ],
      },
      {
        title: "React Fundamentals",
        lessons: [
          { title: "Props and State", duration: "25:00", preview: false },
          { title: "Event Handling", duration: "20:00", preview: false },
          { title: "Conditional Rendering", duration: "15:00", preview: false },
          { title: "Lists and Keys", duration: "18:00", preview: false },
        ],
      },
      {
        title: "Hooks Deep Dive",
        lessons: [
          { title: "useState Hook", duration: "22:00", preview: false },
          { title: "useEffect Hook", duration: "28:00", preview: false },
          { title: "useContext Hook", duration: "20:00", preview: false },
          { title: "Custom Hooks", duration: "25:00", preview: false },
        ],
      },
      {
        title: "Advanced Patterns",
        lessons: [
          { title: "Higher Order Components", duration: "20:00", preview: false },
          { title: "Render Props", duration: "18:00", preview: false },
          { title: "Performance Optimization", duration: "30:00", preview: false },
        ],
      },
    ],
    reviews: [
      {
        name: "Sarah M.",
        avatar: "S",
        rating: 5,
        date: "2 weeks ago",
        text: "This course is amazing! Alex explains everything so clearly. I went from knowing nothing about React to building my own apps.",
      },
      {
        name: "John D.",
        avatar: "J",
        rating: 5,
        date: "1 month ago",
        text: "Best React course I've taken. The projects are practical and the instructor is very responsive to questions.",
      },
      {
        name: "Emily R.",
        avatar: "E",
        rating: 4,
        date: "1 month ago",
        text: "Great content and well-structured. Would love more advanced topics in future updates.",
      },
    ],
  },
};

// Default course for unknown IDs
const defaultCourse: Course = {
  id: "default",
  title: "Complete Web Development Bootcamp",
  description:
    "Learn full-stack web development from scratch. Master HTML, CSS, JavaScript, React, Node.js, and more with hands-on projects.",
  instructor: {
    name: "Sarah Williams",
    avatar: "SW",
    bio: "Full-stack developer and educator with 8+ years of experience building web applications.",
    courses: 8,
    students: 32000,
    rating: 4.8,
  },
  rating: 4.8,
  reviews: 890,
  students: 12500,
  price: 59,
  originalPrice: 119,
  thumbnail: "bg-gradient-to-br from-green-400 to-teal-600",
  duration: "16 weeks",
  lessons: 120,
  level: "Beginner",
  language: "English",
  lastUpdated: "October 2024",
  certificate: true,
  whatYouLearn: [
    "Build responsive websites with HTML & CSS",
    "Master JavaScript fundamentals and ES6+",
    "Create React applications",
    "Build REST APIs with Node.js",
    "Work with databases (MongoDB, PostgreSQL)",
    "Deploy applications to the cloud",
  ],
  requirements: [
    "No programming experience required",
    "A computer with internet access",
    "Willingness to learn",
  ],
  curriculum: [
    {
      title: "Web Fundamentals",
      lessons: [
        { title: "Introduction to Web Development", duration: "12:00", preview: true },
        { title: "HTML Basics", duration: "25:00", preview: true },
        { title: "CSS Styling", duration: "30:00", preview: false },
      ],
    },
    {
      title: "JavaScript Essentials",
      lessons: [
        { title: "JavaScript Basics", duration: "28:00", preview: false },
        { title: "DOM Manipulation", duration: "22:00", preview: false },
        { title: "Async JavaScript", duration: "35:00", preview: false },
      ],
    },
  ],
  reviews: [
    {
      name: "Mike T.",
      avatar: "M",
      rating: 5,
      date: "1 week ago",
      text: "Excellent course for beginners. Very comprehensive and well-paced.",
    },
  ],
};

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
  thumbnail: string;
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

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const course = courseData[id] || defaultCourse;
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "reviews">("overview");

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const totalLessons = course.curriculum.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );
  const totalDuration = course.curriculum.reduce((acc, section) => {
    return (
      acc +
      section.lessons.reduce((lessonAcc, lesson) => {
        const [mins] = lesson.duration.split(":").map(Number);
        return lessonAcc + mins;
      }, 0)
    );
  }, 0);

  const handleEnroll = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = `/auth/login?next=${encodeURIComponent(`/courses/${id}`)}`;
      return;
    }
    alert("Enrollment successful! You can now access the course.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`relative ${course.thumbnail} py-8 sm:py-12 md:py-16`}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/70 text-xs sm:text-sm mb-4">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link href="/courses" className="hover:text-white">
                Courses
              </Link>
              <span>/</span>
              <span className="text-white">{course.title}</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4">
              {course.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 max-w-3xl">
              {course.description}
            </p>

            {/* Course Meta */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm mb-4 sm:mb-6">
              <div className="flex items-center gap-1">
                <StarRating value={course.rating} />
                <span className="font-semibold">{course.rating}</span>
                <span className="text-white/70">
                  ({typeof course.reviews === "number" ? course.reviews : course.reviews.length} reviews)
                </span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span>{course.students.toLocaleString()} students</span>
              <span className="hidden sm:inline">•</span>
              <span>{course.duration}</span>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Tabs */}
            <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border">
              {(["overview", "curriculum", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-orange-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6 sm:space-y-8">
                {/* What You'll Learn */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                    What you'll learn
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {course.whatYouLearn.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <span className="text-orange-500">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {/* Curriculum Tab */}
            {activeTab === "curriculum" && (
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-5 border-b bg-slate-50">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Course Content
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {course.curriculum.length} sections • {totalLessons} lessons •{" "}
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                  </p>
                </div>
                <div className="divide-y">
                  {course.curriculum.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                      <button
                        onClick={() => toggleSection(sectionIdx)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform ${
                              expandedSections.includes(sectionIdx) ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                          <span className="font-semibold text-sm sm:text-base text-slate-900">
                            {section.title}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm text-slate-500">
                          {section.lessons.length} lessons
                        </span>
                      </button>
                      {expandedSections.includes(sectionIdx) && (
                        <div className="bg-slate-50 divide-y divide-slate-100">
                          {section.lessons.map((lesson, lessonIdx) => (
                            <div
                              key={lessonIdx}
                              className="flex items-center justify-between px-4 sm:px-5 py-3 pl-10 sm:pl-12"
                            >
                              <div className="flex items-center gap-3">
                                <svg
                                  className="w-4 h-4 text-slate-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-xs sm:text-sm text-slate-700">
                                  {lesson.title}
                                </span>
                                {lesson.preview && (
                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] sm:text-xs font-medium rounded">
                                    Preview
                                  </span>
                                )}
                              </div>
                              <span className="text-xs sm:text-sm text-slate-500">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {(Array.isArray(course.reviews) ? course.reviews : []).map(
                  (review, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                          {review.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                              {review.name}
                            </h4>
                            <span className="text-xs text-slate-500">{review.date}</span>
                          </div>
                          <div className="mt-1">
                            <StarRating value={review.rating} />
                          </div>
                          <p className="mt-2 text-sm text-slate-600">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border sticky top-20 overflow-hidden">
              {/* Preview Image */}
              <div className={`h-40 sm:h-48 ${course.thumbnail} relative`}>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <span className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                  Bestseller
                </span>
              </div>

              <div className="p-4 sm:p-5">
                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    ${course.price}
                  </span>
                  <span className="text-base sm:text-lg text-slate-400 line-through">
                    ${course.originalPrice}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                  </span>
                </div>

                {/* CTA Buttons */}
                <button
                  onClick={handleEnroll}
                  className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold text-sm sm:text-base hover:from-orange-600 hover:to-orange-500 transition shadow-lg"
                >
                  Enroll Now
                </button>
                <button className="w-full mt-2 py-3 sm:py-3.5 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold text-sm sm:text-base hover:bg-orange-50 transition">
                  Add to Wishlist
                </button>

                <p className="text-center text-xs text-slate-500 mt-3">
                  30-day money-back guarantee
                </p>

                {/* Course Includes */}
                <div className="mt-5 pt-5 border-t space-y-3">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    This course includes:
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>📹</span>
                      <span>{Math.floor(totalDuration / 60)}+ hours of video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📚</span>
                      <span>{totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>♾️</span>
                      <span>Full lifetime access</span>
                    </div>
                    {course.certificate && (
                      <div className="flex items-center gap-2">
                        <span>🏆</span>
                        <span>Certificate of completion</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share */}
                <div className="mt-5 pt-5 border-t">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs text-slate-500">Share:</span>
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
                      📤
                    </button>
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition">
                      🔗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Competitive Challenges */}
    <CompetitiveChallenges courseId={id} />

    {/* Structured Examinations */}
    <StructuredExamination courseId={id} />

    {/* Live Chat Component */}
    <LiveChat courseId={id} />
  </div>
);
}
