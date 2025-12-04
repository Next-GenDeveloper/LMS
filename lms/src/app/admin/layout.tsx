"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn, getUserFromToken } from "@/lib/auth";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Courses", href: "/admin/courses", icon: "📚" },
  { name: "Users", href: "/admin/users", icon: "👥" },
  { name: "Enrollments", href: "/admin/enrollments", icon: "💳" },
  { name: "Announcements", href: "/admin/announcements", icon: "📢" },
  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") return; // Allow login page

    if (!isLoggedIn()) {
      router.replace("/admin/login");
      return;
    }

    const user = getUserFromToken();
    if (!user || user.role !== "admin") {
      // Clear invalid token and redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("userProfile");
      router.replace("/admin/login");
      return;
    }
  }, [router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 px-4 border-b">
              <h1 className="text-xl font-bold text-purple-600">9tangle Admin</h1>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-purple-100 text-purple-700 border-r-2 border-purple-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("userProfile");
                  router.push("/admin/login");
                }}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <span className="mr-3">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.href === pathname)?.name || "Admin Panel"}
                </h2>
                <div className="text-sm text-gray-500">
                  Welcome back, Admin
                </div>
              </div>
            </div>
          </header>

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}