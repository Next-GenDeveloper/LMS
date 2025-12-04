"use client";

import { useRequireInstructor } from "@/lib/use-require-instructor";

export default function InstructorsPage() {
  useRequireInstructor();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Instructor Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Courses</h2>
            <p className="text-gray-600">Manage your courses and content</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Students</h2>
            <p className="text-gray-600">View enrolled students</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
            <p className="text-gray-600">Course performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
}