"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";

export function Navbar() {
  return <NavbarContent />;
}

export default Navbar;

// Cart Dropdown Component with Checkout Button
function CartDropdown({ cartItemCount, cartItems, showCartPreview, setShowCartPreview }: { 
  cartItemCount: number, 
  cartItems: any[], 
  showCartPreview: boolean, 
  setShowCartPreview: (show: boolean) => void 
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCartPreview(false);
      }
    };

    if (showCartPreview) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCartPreview, setShowCartPreview]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowCartPreview(!showCartPreview)}
        className="relative px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
      >
        🛒 Cart
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>
      
      {showCartPreview && cartItemCount > 0 && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-pink-500">
            <h3 className="font-bold text-white text-lg">Shopping Cart ({cartItemCount})</h3>
          </div>
          
          <div className="max-h-80 overflow-y-auto p-4 space-y-3">
            {cartItems.slice(0, 4).map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.images && item.images.length > 0 ? (
                    item.images[0].startsWith('data:') || item.images[0].startsWith('http') ? (
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{item.images[0]}</span>
                    )
                  ) : (
                    <span className="text-2xl">{item.image}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm line-clamp-1">{item.name}</p>
                  <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                  <p className="text-orange-500 font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {cartItems.length > 4 && (
              <p className="text-center text-sm text-slate-600">+{cartItems.length - 4} more items</p>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">Total:</span>
              <span className="text-xl font-bold text-orange-500">Rs. {total.toLocaleString()}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition text-center"
              onClick={() => setShowCartPreview(false)}
            >
              Checkout Now
            </Link>
            <Link
              href="/cart"
              className="block w-full py-2 text-center text-blue-600 font-semibold hover:text-blue-700 text-sm"
              onClick={() => setShowCartPreview(false)}
            >
              View Full Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Profile Dropdown Component with Click-to-Stay-Open functionality
function ProfileDropdown({ userName, userRole, handleLogout }: { userName: string, userRole: string, handleLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent text-primary font-medium text-sm"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden lg:inline">{userName}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div className={`absolute right-0 top-full mt-1 w-48 bg-card rounded-xl shadow-lg border border-border transition-all duration-200 z-50 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <Link
          href={(() => {
            const profile = localStorage.getItem("userProfile");
            if (profile) {
              try {
                const p = JSON.parse(profile);
                return p.role === 'admin' ? "/admin/dashboard" : "/dashboard/Student";
              } catch {
                return "/dashboard/Student";
              }
            }
            return "/dashboard/Student";
          })()}
          className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-t-xl"
          onClick={() => setIsOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/profile"
          className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500"
          onClick={() => setIsOpen(false)}
        >
          Profile
        </Link>
        <Link
          href="/my-learning"
          className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary"
          onClick={() => setIsOpen(false)}
        >
          My Courses
        </Link>
        <Link
          href="/my-orders"
          className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary"
          onClick={() => setIsOpen(false)}
        >
          My Orders
        </Link>
        <hr className="border-orange-100" />
        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-b-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function NavbarContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const coursesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check auth status on mount
    const token = localStorage.getItem("authToken");
    const profile = localStorage.getItem("userProfile");
    if (token) {
      setIsLoggedIn(true);
      if (profile) {
        try {
          const p = JSON.parse(profile);
          setUserRole(p.role || "");
          if (p.role === 'admin') {
            setUserName("Logged in as Admin");
          } else {
            setUserName(p.firstName || "User");
          }
        } catch {
          setUserName("User");
        }
      }
    }
    
    // Update cart count and items
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItemCount(cart.length);
      setCartItems(cart);
    };
    
    updateCart();
    
    // Listen for storage changes to update cart count in real-time
    window.addEventListener('storage', updateCart);
    
    // Custom event listener for cart updates in same tab
    const handleCartUpdate = () => updateCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Also check periodically in case same tab updates
    const interval = setInterval(updateCart, 1000);
    
    return () => {
      window.removeEventListener('storage', updateCart);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (coursesDropdownRef.current && !coursesDropdownRef.current.contains(event.target as Node)) {
        setIsCoursesOpen(false);
      }
    };

    if (isCoursesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCoursesOpen]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("profileDraft");
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    window.location.href = "/";
  };

  return (
    <header className="w-full border-b bg-card/90 backdrop-blur sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto flex h-14 sm:h-16 w-full max-w-6xl items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm sm:text-base">
            9T
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-foreground">
            9Tangle
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition"
          >
            Shop
          </Link>
          <div className="relative" ref={coursesDropdownRef}>
            <button
              onClick={() => setIsCoursesOpen(!isCoursesOpen)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition flex items-center gap-1"
            >
              Courses
              <svg
                className={`w-4 h-4 transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className={`absolute left-0 top-full mt-1 w-48 bg-card rounded-xl shadow-lg border border-border transition-all duration-200 z-50 ${
                isCoursesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}>
              <Link
                href="/courses"
                className="block px-4 py-2.5 text-sm text-foreground hover:bg-accent hover:text-primary rounded-t-xl"
                onClick={() => setIsCoursesOpen(false)}
              >
                All Courses
              </Link>
              <Link
                href="/my-learning"
                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                onClick={() => setIsCoursesOpen(false)}
              >
                My Learning
              </Link>
              {userRole === 'admin' && (
                <>
                  <Link
                    href="/admin/courses"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500"
                    onClick={() => setIsCoursesOpen(false)}
                  >
                    Manage Courses
                  </Link>
                  <Link
                    href="/admin/courses/create"
                    className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-500 rounded-b-xl"
                    onClick={() => setIsCoursesOpen(false)}
                  >
                    Create Course
                  </Link>
                </>
              )}
            </div>
          </div>
          <Link
            href="/contact"
            className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition"
          >
            Contact
          </Link>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <CartDropdown 
            cartItemCount={cartItemCount}
            cartItems={cartItems}
            showCartPreview={showCartPreview}
            setShowCartPreview={setShowCartPreview}
          />
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Link
                href="/my-learning"
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition"
              >
                My Learning
              </Link>
              <Link
                href="/my-orders"
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition"
              >
                My Orders
              </Link>
              <ProfileDropdown 
                userName={userName}
                userRole={userRole}
                handleLogout={handleLogout}
              />
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full border border-border bg-card text-sm font-semibold text-primary hover:bg-accent transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-sm hover:from-primary/90 hover:to-primary transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-accent transition"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              href="/"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-primary transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition relative"
              onClick={() => setIsMenuOpen(false)}
            >
              🛒 Cart
              {cartItemCount > 0 && (
                <span className="inline-block ml-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 text-center leading-5">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href="/courses"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              All Courses
            </Link>
            {userRole === 'admin' && (
              <>
                <Link
                  href="/admin/courses"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Manage Courses
                </Link>
                <Link
                  href="/admin/courses/create"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Course
                </Link>
              </>
            )}
            <Link
              href="/contact"
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {isLoggedIn && (
              <>
                <hr className="border-border my-2" />
                <Link
                  href={userRole === 'admin' ? "/admin/dashboard" : "/dashboard/Student"}
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/my-learning"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Learning
                </Link>
                <Link
                  href="/my-orders"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}

            <div className="pt-3 mt-2 border-t border-border space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full border border-destructive text-sm font-semibold text-destructive hover:bg-destructive/10 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block w-full text-center py-2.5 rounded-full border border-border bg-card text-sm font-semibold text-primary hover:bg-accent transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full text-center py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-sm hover:from-primary/90 hover:to-primary transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
