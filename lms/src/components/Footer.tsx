// src/components/Footer.tsx
"use client";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-xl">
                9T
              </div>
              <div className="text-2xl font-bold tracking-tight">9tangle</div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering learners worldwide with cutting-edge online education. Join thousands of students and instructors in their journey to success.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors duration-200" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/courses" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Browse Courses</Link></li>
              <li><Link href="/dashboard/Student" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">My Learning</Link></li>
              <li><Link href="/dashboard/Admin" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Instructor Dashboard</Link></li>
              <li><Link href="/instructors" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Find Instructors</Link></li>
              <li><Link href="/certificates" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Certificates</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Contact</Link></li>
              <li><Link href="/careers" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Careers</Link></li>
              <li><Link href="/blog" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Blog</Link></li>
              <li><Link href="/press" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Press</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Help Center</Link></li>
              <li><Link href="/faq" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">FAQ</Link></li>
              <li><Link href="/privacy" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Terms of Service</Link></li>
              <li><Link href="/accessibility" className="text-slate-300 hover:text-white transition-colors duration-200 text-sm">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="max-w-md mx-auto text-center lg:mx-0 lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-slate-300 text-sm">Get the latest courses, learning tips, and platform updates delivered to your inbox.</p>
            </div>
            <div className="mt-4 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
              <form className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700 bg-slate-800">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © {year} 9tangle LMS. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <span>Made with ❤️ for learners worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
