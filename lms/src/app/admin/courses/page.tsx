"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  description: string;
  bannerImage?: string;
  thumbnail?: string;
  instructor?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  category: string;
  price: number;
  rating: number;
  reviews: number;
  enrollmentCount: number;
  level: string;
  isPublished: boolean;
  createdAt: string;
  duration?: number;
  language?: string;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/admin/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (!response.headers.get('content-type')?.includes('application/json')) {
          throw new Error('Expected JSON response');
        }
        const data = await response.json();
        setCourses(data.courses || []);
      } else {
        if (response.headers.get('content-type')?.includes('application/json')) {
          const error = await response.json();
          console.error("Failed to fetch courses:", error);
        } else {
          console.error("Failed to fetch courses: Server returned non-JSON response");
        }
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCourses(courses.filter(course => course._id !== courseId));
        alert("Course deleted successfully!");
      } else {
        alert("Failed to delete course");
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      alert("Failed to delete course");
    }
  };

  const togglePublishStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (response.ok) {
        setCourses(courses.map(course => 
          course._id === courseId ? { ...course, isPublished: !currentStatus } : course
        ));
      } else {
        alert("Failed to update course status");
      }
    } catch (error) {
      console.error("Failed to update course:", error);
      alert("Failed to update course");
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || course.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "published" && course.isPublished) ||
                         (filterStatus === "draft" && !course.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(courses.map(c => c.category)));

  const getImageUrl = (course: Course) => {
    const image = course.bannerImage || course.thumbnail;
    if (!image) return "/next.svg";
    if (image.startsWith('http')) return image;
    return `http://localhost:5000${image}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Course Management</h1>
            <p className="text-indigo-100">Manage and organize your courses</p>
          </div>
          <Link
            href="/admin/courses/create"
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Create New Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{courses.length}</div>
            <div className="text-indigo-100 text-sm">Total Courses</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {courses.filter(c => c.isPublished).length}
            </div>
            <div className="text-indigo-100 text-sm">Published</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.enrollmentCount, 0)}
            </div>
            <div className="text-indigo-100 text-sm">Total Enrollments</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-indigo-100 text-sm">Categories</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Courses</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-indigo-600">{filteredCourses.length}</span> of {courses.length} courses
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
              setFilterStatus("all");
            }}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onDelete={handleDeleteCourse}
              onTogglePublish={togglePublishStatus}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseListItem
              key={course._id}
              course={course}
              onDelete={handleDeleteCourse}
              onTogglePublish={togglePublishStatus}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({ 
  course, 
  onDelete, 
  onTogglePublish,
  getImageUrl 
}: { 
  course: Course; 
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, status: boolean) => void;
  getImageUrl: (course: Course) => string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
        <Image
          src={getImageUrl(course)}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            course.isPublished 
              ? "bg-green-500 text-white" 
              : "bg-yellow-500 text-white"
          }`}>
            {course.isPublished ? "Published" : "Draft"}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-indigo-600 capitalize">
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded">
            {course.category}
          </span>
        </div>

        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-t border-b">
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">${course.price}</div>
            <div className="text-xs text-gray-500">Price</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{course.enrollmentCount}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/courses/${course._id}`}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-center text-sm font-semibold"
          >
            View
          </Link>
          <Link
            href={`/admin/courses/${course._id}/edit`}
            className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition text-center text-sm font-semibold"
          >
            Edit
          </Link>
          <button
            onClick={() => onTogglePublish(course._id, course.isPublished)}
            className={`flex-1 px-3 py-2 rounded-lg transition text-sm font-semibold ${
              course.isPublished
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {course.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>

        <button
          onClick={() => onDelete(course._id)}
          className="w-full mt-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-semibold"
        >
          Delete Course
        </button>
      </div>
    </div>
  );
}

// Course List Item Component
function CourseListItem({ 
  course, 
  onDelete, 
  onTogglePublish,
  getImageUrl 
}: { 
  course: Course; 
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, status: boolean) => void;
  getImageUrl: (course: Course) => string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all">
      <div className="flex gap-5">
        {/* Thumbnail */}
        <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
          <Image
            src={getImageUrl(course)}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded">
                  {course.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded capitalize">
                  {course.level}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  course.isPublished 
                    ? "bg-green-500 text-white" 
                    : "bg-yellow-500 text-white"
                }`}>
                  {course.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              
              <h3 className="font-bold text-xl text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-indigo-600">${course.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>{course.enrollmentCount} students</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{course.duration}h</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/courses/${course._id}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold text-center"
          >
            View
          </Link>
          <Link
            href={`/admin/courses/${course._id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold text-center"
          >
            Edit
          </Link>
          <button
            onClick={() => onTogglePublish(course._id, course.isPublished)}
            className={`px-4 py-2 rounded-lg transition text-sm font-semibold ${
              course.isPublished
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {course.isPublished ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => onDelete(course._id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
