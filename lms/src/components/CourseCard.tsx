"use client";
import Image from "next/image";
import Link from "next/link";
import { API_BASE } from "@/lib/api";

function getImageUrl(url: string): string {
  if (url.startsWith('/uploads/')) {
    return `${API_BASE}${url}`;
  }
  return url;
}

export type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string; // legacy field
  bannerImage?: string; // API field
  thumbnail?: string;
  price: number;
  author?: string;
  progress?: number; // 0-100
  rating?: number;
  reviews?: number;
  level?: string;
  enrollmentCount?: number;
};

export default function CourseCard({ course, onClick }: { course: Course; onClick?: (id: string) => void }) {
  const imageUrl = course.imageUrl || course.bannerImage || course.thumbnail || "/next.svg";
  
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group rounded-3xl border border-orange-100 overflow-hidden bg-white/95 hover:shadow-2xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1">
        {/* Course Thumbnail */}
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
          <Image 
            src={getImageUrl(imageUrl)} 
            alt={course.title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {course.level && (
            <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-orange-600 rounded-full capitalize">
              {course.level}
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-orange-500 transition">
            {course.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>

          {/* Rating and Stats */}
          <div className="flex items-center gap-2 text-sm">
            {course.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="font-semibold text-slate-900">{course.rating}</span>
                <span className="text-slate-500">({course.reviews || 0})</span>
              </div>
            )}
            {course.enrollmentCount !== undefined && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{course.enrollmentCount} students</span>
              </>
            )}
          </div>

          {/* Progress Bar (if applicable) */}
          {typeof course.progress === "number" && (
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all"
                  style={{ width: `${Math.max(0, Math.min(100, course.progress))}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">{course.progress}% completed</p>
            </div>
          )}

          {/* Price */}
          <div className="pt-3 border-t border-orange-100 flex items-center justify-between">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Rs. {course.price.toLocaleString()}
            </span>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-orange-500 transition">
              View Course
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
