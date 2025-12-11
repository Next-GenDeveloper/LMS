'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Products', href: '/admin/products', icon: '📦', submenu: [
      { label: 'Track Orders', href: '/tracking', icon: '📍' }
    ]},
    { label: 'Orders', href: '/admin/orders', icon: '🛒' },
    { label: 'Announcements', href: '/admin/announcements', icon: '📢' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-700 to-blue-900 text-white w-64 shadow-2xl z-30 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:h-auto md:bg-none md:shadow-none`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-600">
          <h1 className="text-2xl font-bold">🎓 9Tangle Admin</h1>
          <p className="text-blue-100 text-sm mt-1">Management Dashboard</p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === item.label ? null : item.label)}
                    className={`flex items-center gap-4 px-6 py-4 transition-all w-full ${
                      isActive(item.href)
                        ? 'bg-blue-600 border-r-4 border-orange-500 shadow-inner'
                        : 'hover:bg-blue-600/50'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-semibold">{item.label}</span>
                    {isActive(item.href) && <span className="ml-auto">→</span>}
                    <svg
                      className={`ml-auto w-4 h-4 transition-transform ${expandedMenu === item.label ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedMenu === item.label && (
                    <div className="bg-blue-800/50">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="flex items-center gap-3 px-10 py-3 text-sm hover:bg-blue-600/50 transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="text-lg">{subitem.icon}</span>
                          <span>{subitem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-6 py-4 transition-all ${
                    isActive(item.href)
                      ? 'bg-blue-600 border-r-4 border-orange-500 shadow-inner'
                      : 'hover:bg-blue-600/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                  {isActive(item.href) && <span className="ml-auto">→</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-800/50 border-t border-blue-600 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Products</span>
              <span className="font-bold">24</span>
            </div>
            <div className="flex justify-between">
              <span>Orders Today</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex justify-between">
              <span>Revenue</span>
              <span className="font-bold">$3.2K</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Padding on Desktop */}
      <div className="md:hidden" />
    </>
  );
}
