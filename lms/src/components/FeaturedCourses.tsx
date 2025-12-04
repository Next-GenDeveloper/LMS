"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/components/StarRating";

type Course = {
  id: number;
  title: string;
  instructor: string;
  price: number;
  rating: number;
  students: number;
  image: string;
  badge: string;
  duration: string;
  description: string;
  whatYouLearn: string[];
  curriculum: { title: string; lessons: number; duration: string }[];
  level: string;
  language: string;
  certificate: boolean;
};

const courses: Course[] = [
  {
    id: 1,
    title: "Complete React Development",
    instructor: "Alex Johnson",
    price: 49,
    rating: 4.9,
    students: 12500,
    image: "bg-gradient-to-br from-blue-500 to-purple-600",
    badge: "Bestseller",
    duration: "12 weeks",
    description: "Master React from scratch and build modern, interactive web applications. Learn hooks, context, routing, and state management with hands-on projects.",
    whatYouLearn: [
      "Build scalable React applications",
      "Master React Hooks and Context API",
      "Implement routing with React Router",
      "State management best practices",
      "Testing and debugging techniques"
    ],
    curriculum: [
      { title: "React Fundamentals", lessons: 15, duration: "4 hours" },
      { title: "Hooks & Advanced Patterns", lessons: 12, duration: "5 hours" },
      { title: "State Management", lessons: 10, duration: "4 hours" },
      { title: "Routing & Navigation", lessons: 8, duration: "3 hours" },
      { title: "Testing & Deployment", lessons: 6, duration: "2 hours" }
    ],
    level: "Beginner to Advanced",
    language: "English",
    certificate: true
  },
  {
    id: 2,
    title: "Advanced JavaScript Mastery",
    instructor: "Sarah Williams",
    price: 59,
    rating: 4.8,
    students: 8900,
    image: "bg-gradient-to-br from-yellow-400 to-orange-500",
    badge: "New",
    duration: "10 weeks",
    description: "Deep dive into advanced JavaScript concepts including closures, async/await, design patterns, and performance optimization.",
    whatYouLearn: [
      "Advanced ES6+ features",
      "Async programming patterns",
      "Design patterns in JavaScript",
      "Performance optimization",
      "Memory management"
    ],
    curriculum: [
      { title: "Advanced Functions", lessons: 10, duration: "3 hours" },
      { title: "Async & Promises", lessons: 8, duration: "4 hours" },
      { title: "Design Patterns", lessons: 12, duration: "5 hours" },
      { title: "Performance Optimization", lessons: 9, duration: "3 hours" }
    ],
    level: "Intermediate to Advanced",
    language: "English",
    certificate: true
  },
  {
    id: 3,
    title: "Full-Stack Web Development",
    instructor: "Michael Chen",
    price: 79,
    rating: 4.9,
    students: 15200,
    image: "bg-gradient-to-br from-green-400 to-teal-600",
    badge: "Popular",
    duration: "16 weeks",
    description: "Complete full-stack development course covering frontend, backend, databases, and deployment. Build real-world projects.",
    whatYouLearn: [
      "Full-stack architecture",
      "RESTful API development",
      "Database design & management",
      "Authentication & security",
      "Deployment strategies"
    ],
    curriculum: [
      { title: "Frontend Development", lessons: 20, duration: "8 hours" },
      { title: "Backend Development", lessons: 18, duration: "10 hours" },
      { title: "Database Management", lessons: 12, duration: "6 hours" },
      { title: "Authentication & Security", lessons: 10, duration: "4 hours" },
      { title: "Deployment & DevOps", lessons: 8, duration: "3 hours" }
    ],
    level: "Beginner to Advanced",
    language: "English",
    certificate: true
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    instructor: "Emma Davis",
    price: 45,
    rating: 4.7,
    students: 6800,
    image: "bg-gradient-to-br from-pink-400 to-rose-600",
    badge: "Trending",
    duration: "8 weeks",
    description: "Learn the principles of great UI/UX design. Create beautiful, user-friendly interfaces that users love.",
    whatYouLearn: [
      "Design thinking process",
      "User research methods",
      "Wireframing & prototyping",
      "Visual design principles",
      "Usability testing"
    ],
    curriculum: [
      { title: "Design Fundamentals", lessons: 10, duration: "4 hours" },
      { title: "User Research", lessons: 8, duration: "3 hours" },
      { title: "Prototyping", lessons: 12, duration: "5 hours" },
      { title: "Visual Design", lessons: 10, duration: "4 hours" }
    ],
    level: "Beginner",
    language: "English",
    certificate: true
  },
  {
    id: 5,
    title: "Python Data Science",
    instructor: "David Lee",
    price: 69,
    rating: 4.8,
    students: 11200,
    image: "bg-gradient-to-br from-indigo-500 to-blue-700",
    badge: "Hot",
    duration: "14 weeks",
    description: "Master data science with Python. Learn pandas, numpy, matplotlib, and machine learning basics.",
    whatYouLearn: [
      "Data manipulation with Pandas",
      "Data visualization",
      "Statistical analysis",
      "Machine learning basics",
      "Real-world data projects"
    ],
    curriculum: [
      { title: "Python Basics", lessons: 12, duration: "5 hours" },
      { title: "Data Analysis", lessons: 15, duration: "7 hours" },
      { title: "Visualization", lessons: 10, duration: "4 hours" },
      { title: "Machine Learning", lessons: 14, duration: "6 hours" }
    ],
    level: "Intermediate",
    language: "English",
    certificate: true
  },
  {
    id: 6,
    title: "Cloud Architecture & AWS",
    instructor: "Lisa Anderson",
    price: 89,
    rating: 4.9,
    students: 9800,
    image: "bg-gradient-to-br from-cyan-400 to-blue-600",
    badge: "Premium",
    duration: "18 weeks",
    description: "Comprehensive guide to cloud computing and AWS services. Build scalable, secure cloud infrastructure.",
    whatYouLearn: [
      "Cloud computing fundamentals",
      "AWS core services",
      "Infrastructure as Code",
      "Security best practices",
      "Cost optimization"
    ],
    curriculum: [
      { title: "Cloud Fundamentals", lessons: 10, duration: "4 hours" },
      { title: "AWS Core Services", lessons: 18, duration: "10 hours" },
      { title: "Infrastructure as Code", lessons: 12, duration: "6 hours" },
      { title: "Security & Compliance", lessons: 10, duration: "4 hours" }
    ],
    level: "Intermediate to Advanced",
    language: "English",
    certificate: true
  },
];

export default function FeaturedCourses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openModal = (course: Course) => {
    setSelectedCourse(course);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedCourse(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      {/* Featured Courses */}
      <section className="relative py-20 bg-gradient-to-b from-white via-gray-50/30 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div className="mb-4 md:mb-0">
              <p className="text-sm font-semibold text-[#0053b8] dark:text-blue-400 uppercase tracking-wider mb-2">
                Explore Our Courses
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                Featured Courses
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
                Discover world-class courses designed by industry experts to accelerate your career
              </p>
            </div>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0053b8] text-white font-semibold hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Courses
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Courses Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <div
                key={course.id}
                onClick={() => openModal(course)}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Course Image */}
                <div className="relative h-52 overflow-hidden">
                  <div className={`absolute inset-0 ${course.image} opacity-95 group-hover:opacity-100 transition-opacity duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#d62828] shadow-lg animate-pulse">
                      {course.badge}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-6 py-3 rounded-full bg-white/95 backdrop-blur text-[#0053b8] font-semibold shadow-xl">
                      View Details
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6 space-y-4">
                  {/* Title & Price */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#0053b8] dark:group-hover:text-blue-400 transition-colors line-clamp-2 flex-1">
                      {course.title}
                    </h3>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-extrabold text-[#0053b8] dark:text-blue-400">
                        ${course.price}
                      </div>
                      <div className="text-xs text-gray-500 line-through">${course.price + 20}</div>
                    </div>
                  </div>


                  {/* Rating & Students */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <StarRating value={course.rating} />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {course.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({course.students.toLocaleString()})
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {course.duration}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0053b8] to-[#003a80] hover:from-[#003a80] hover:to-[#0053b8] text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg">
                    Enroll Now
                  </button>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors shadow-lg"
            >
              <span className="text-2xl">×</span>
            </button>

            {/* Modal Content */}
            <div className="relative">
              {/* Hero Image */}
              <div className={`relative h-64 ${selectedCourse.image} overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-[#d62828] mb-3">
                    {selectedCourse.badge}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{selectedCourse.title}</h2>
                  <p className="text-blue-100 text-lg">{selectedCourse.description}</p>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                {/* Course Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</div>
                    <div className="flex items-center gap-1">
                      <StarRating value={selectedCourse.rating} />
                      <span className="font-bold text-lg">{selectedCourse.rating}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Students</div>
                    <div className="font-bold text-lg">{selectedCourse.students.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</div>
                    <div className="font-bold text-lg">{selectedCourse.duration}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Level</div>
                    <div className="font-bold text-lg">{selectedCourse.level}</div>
                  </div>
                </div>

                {/* What You'll Learn */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">What You'll Learn</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedCourse.whatYouLearn.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                        <span className="text-[#0053b8] dark:text-blue-400 text-xl mt-0.5">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Course Curriculum</h3>
                  <div className="space-y-3">
                    {selectedCourse.curriculum.map((section, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#0053b8] text-white flex items-center justify-center font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{section.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {section.lessons} lessons • {section.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-5">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Includes</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400">✓</span>
                        <span className="text-gray-700 dark:text-gray-300">{selectedCourse.language} Language</span>
                      </div>
                      {selectedCourse.certificate && (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">Certificate of Completion</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#0053b8] to-[#003a80] hover:from-[#003a80] hover:to-[#0053b8] text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                    Enroll Now - ${selectedCourse.price}
                  </button>
                  <button className="px-6 py-4 rounded-xl border-2 border-teal-600 text-[#0053b8] dark:text-blue-400 font-semibold hover:bg-[#0053b8] hover:text-white dark:hover:bg-blue-600 transition-all duration-300">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

