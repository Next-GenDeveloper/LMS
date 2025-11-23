// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Learn Anything,<br />Anytime, Anywhere
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            Join thousands of students learning from expert instructors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="inline-block">
              <button className="text-lg px-8 py-6 bg-white text-purple-900 hover:bg-gray-100 rounded-md font-semibold transition-colors">
                Browse Courses →
              </button>
            </Link>
            <Link href="/(auth)/register" className="inline-block">
              <button className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-purple-900 rounded-md font-semibold transition-colors">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow">
              <div className="mb-4">
                <div className="w-12 h-12 text-purple-600 mb-4">📚</div>
                <h3 className="text-xl font-bold">Expert Courses</h3>
              </div>
              <p className="text-gray-600">Learn from industry experts with years of real-world experience</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <div className="mb-4">
                <div className="w-12 h-12 text-blue-600 mb-4">👥</div>
                <h3 className="text-xl font-bold">Lifetime Access</h3>
              </div>
              <p className="text-gray-600">Once you enroll, access your courses forever with free updates</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <div className="mb-4">
                <div className="w-12 h-12 text-green-600 mb-4">🏆</div>
                <h3 className="text-xl font-bold">Certificates</h3>
              </div>
              <p className="text-gray-600">Earn shareable certificates to boost your career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Preview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Popular Courses</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="overflow-hidden hover:shadow-xl transition-shadow rounded-lg bg-white shadow">
                <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-48" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Complete Web Development Bootcamp {i}</h3>
                  <p className="text-gray-600 mb-4">Instructor Name • 4.9 ⭐ (1,234)</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">$49.99</span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">Enroll Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}