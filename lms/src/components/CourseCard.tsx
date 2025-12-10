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
  price: number;
  author?: string;
  progress?: number; // 0-100
};

export default function CourseCard({ course, onClick }: { course: Course; onClick?: (id: string) => void }) {
  return (
    <div
      role="button"
      onClick={(e) => {
        // prevent card click from interfering with inner buttons
        const target = e.target as HTMLElement;
        if (target.closest("a,button")) return;
        onClick?.(course.id);
      }}
      className="group rounded-xl border overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image src={getImageUrl(course.imageUrl || course.bannerImage || "/next.svg")} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-snug">{course.title}</h3>
          <span className="shrink-0 rounded-md bg-purple-600/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 text-sm font-medium">
            Rs {course.price.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{course.description}</p>
        {typeof course.progress === "number" && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200/60 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
                style={{ width: `${Math.max(0, Math.min(100, course.progress))}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{course.progress}% completed</p>
          </div>
        )}
        <div className="pt-2 flex gap-2">
          <Link href={`/courses/${course.id}/edit`} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
