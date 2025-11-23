// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  const isLoggedIn = false; // Baad mein auth se connect kar denge
  const userName = "Shahnam Khan";
  const userRole = "Instructor";
  const cartItems = 2;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              📚
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            LearnHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Courses
          </Link>
          <Link
            href="/my-learning"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            My Learning
          </Link>
          <Link
            href="/achievements"
            className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
          >
            Certificates
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-md transition-colors">
            🔍
          </button>

          {/* Cart */}
          <button className="relative p-2 hover:bg-gray-100 rounded-md transition-colors">
            🛒
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                {cartItems}
              </span>
            )}
          </button>

          {/* Auth / User Menu */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 pl-4 border-l">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center font-bold">
                SK
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-3">
              <Link href="/(auth)/login">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/(auth)/register">
                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors">
                  Sign Up Free
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-md transition-colors">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}