import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#fff7f1] text-gray-900">
      {/* Navbar */}
      <header className="w-full bg-[#fff7f1] sticky top-0 z-20 border-b border-orange-100/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-lg">
              M
            </div>
            <span className="font-bold text-lg tracking-tight">MKS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#" className="text-orange-500">
              Home
            </a>
            <a href="#">Courses</a>
            <a href="#">Categories</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex text-sm font-semibold text-gray-800">
              Sign in
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-semibold bg-orange-500 text-white shadow-md hover:bg-orange-600 transition">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="grid md:grid-cols-[1.3fr,1fr] gap-10 py-10 md:py-16 items-center">
          <div>
            <p className="text-xs tracking-[0.2em] font-semibold text-orange-500 mb-3 uppercase">
              A Classical Education
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              A Classical Education for the{" "}
              <span className="text-orange-500">Future</span>
            </h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md">
              Top courses and learning paths created by industry experts. Join
              thousands of students building their career with our platform.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="px-5 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold shadow-md hover:bg-orange-600 transition">
                Start Learning
              </button>
              <button className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full border border-orange-300 flex items-center justify-center text-[10px]">
                  ▶
                </span>
                Watch demo
              </button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-[3rem] bg-[#ffe6d4] relative flex items-center justify-center">
              <div className="w-40 h-40 rounded-[2rem] bg-gradient-to-br from-orange-300 to-pink-300 shadow-xl overflow-hidden flex items-center justify-center">
                <span className="text-4xl font-black text-white">M</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-white shadow-md rounded-2xl px-4 py-3 text-xs">
                <div className="font-semibold">98k+</div>
                <div className="text-gray-500">Active students</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white shadow-md rounded-full px-4 py-2 text-xs flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                  ★
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-xs">4.9</span>
                  <span className="text-[10px] text-gray-500">Course rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Feature Cards */}
        <section className="grid md:grid-cols-3 gap-5 pb-10">
          {[
            {
              title: "Live class with experts",
              desc: "Join live interactive sessions and clear your doubts instantly."
            },
            {
              title: "Certification included",
              desc: "Earn shareable certificates after successful course completion."
            },
            {
              title: "Complete career support",
              desc: "Get guidance, interview prep and placement assistance."
            }
          ].map((item, idx) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl px-5 py-6 shadow-sm border border-orange-100 flex gap-3"
            >
              <div className="mt-1">
                <div className="w-9 h-9 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-lg font-bold">
                  {idx + 1}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Top Categories */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold">Top categories</h2>
            <button className="text-[11px] font-semibold text-orange-500">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Marketing",
              "Design",
              "Programming",
              "Technology"
            ].map((cat) => (
              <div
                key={cat}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-orange-100 cursor-pointer hover:-translate-y-1 transition"
              >
                <div className="h-28 bg-gradient-to-tr from-gray-700 via-gray-900 to-black" />
                <div className="p-3 flex items-center justify-between text-xs font-semibold">
                  <span>{cat}</span>
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                    ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experts Section */}
        <section className="grid md:grid-cols-[1fr,1.2fr] gap-10 items-center py-12">
          <div className="relative flex justify-center">
            <div className="w-52 h-52 rounded-[3rem] bg-[#ffe6d4] flex items-center justify-center shadow-md">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-orange-300 to-rose-300 flex items-center justify-center text-3xl font-black text-white">
                E
              </div>
            </div>
            <div className="absolute -bottom-4 right-6 bg-white rounded-2xl shadow-md px-4 py-2 text-xs">
              <div className="font-semibold">4.8 Instructor rating</div>
              <div className="text-[11px] text-gray-500">
                Based on student feedback
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.23em] uppercase text-orange-500 font-semibold mb-3">
              We are experts
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
              We are <span className="text-orange-500">Experts</span> Learning
              Institution
            </h2>
            <p className="text-sm text-gray-600 mb-5 max-w-xl">
              Learn from a diverse community of instructors, mentors and
              industry professionals. Our curriculum blends theory with
              hands-on practice so you can apply knowledge on real projects
              from day one.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold shadow hover:bg-orange-600">
                Explore Courses
              </button>
              <button className="text-sm font-semibold text-gray-800">
                Learn more
              </button>
            </div>
          </div>
        </section>

        {/* Popular Courses */}
        <section className="py-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold">Explore Our Popular Course</h2>
              <p className="text-xs text-gray-500">
                Handpicked programs trusted by thousands of students.
              </p>
            </div>
            <button className="text-[11px] font-semibold text-orange-500">
              See all
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              "Communication Skills for Professionals",
              "Front-end Development with React",
              "Digital Marketing Masterclass"
            ].map((title, i) => (
              <div
                key={title}
                className="bg-white rounded-3xl p-3 shadow-sm border border-orange-100 flex flex-col gap-2 hover:-translate-y-1 transition"
              >
                <div className="h-28 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-900 to-black mb-2" />
                <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                  {title}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                  <span>24 lessons</span>
                  <span className="font-semibold text-orange-500">
                    {i === 0 ? "$39.00" : i === 1 ? "$49.00" : "$29.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Examination */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold">Popular examination</h2>
            <button className="text-[11px] font-semibold text-orange-500">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["IELTS", "SAT Prep", "PMP Exam", "Coding Interview"].map(
              (exam) => (
                <div
                  key={exam}
                  className="bg-white rounded-3xl p-3 shadow-sm border border-orange-100 hover:-translate-y-1 transition"
                >
                  <div className="h-24 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-900 to-black mb-2" />
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span>{exam}</span>
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                      ↗
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Competition & Form */}
        <section className="py-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.23em] uppercase text-orange-500 font-semibold mb-2">
              Compete worldwide
            </p>
            <h2 className="text-2xl font-extrabold mb-2">
              Compete with various scholars around the globe
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Participate in live competitions, challenges and hackathons
              designed to push your limits and help you stand out.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold shadow hover:bg-orange-600">
                Join competition
              </button>
              <button className="text-sm font-semibold text-gray-800">
                View details
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100">
            <h3 className="text-sm font-semibold mb-3">
              Register for upcoming competition
            </h3>
            <form className="space-y-3 text-xs">
              <div>
                <label className="block mb-1 text-gray-600">Full name</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-orange-100 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-orange-400 bg-[#fffaf5]"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-600">Email</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-orange-100 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-orange-400 bg-[#fffaf5]"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-600">Category</label>
                <select className="w-full rounded-xl border border-orange-100 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-orange-400 bg-[#fffaf5]">
                  <option>Design</option>
                  <option>Programming</option>
                  <option>Business</option>
                  <option>Technology</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-2 px-4 py-2.5 rounded-full bg-orange-500 text-white text-xs font-semibold shadow hover:bg-orange-600"
              >
                Submit application
              </button>
            </form>
          </div>
        </section>

        {/* Featured Competition */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold">Featured Competition</h2>
            <button className="text-[11px] font-semibold text-orange-500">
              See all
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Marketing Contest", "UI/UX Design", "Programming Contest", "Photography"].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white rounded-3xl p-3 shadow-sm border border-orange-100 hover:-translate-y-1 transition"
                >
                  <div className="h-24 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-900 to-black mb-2" />
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span>{item}</span>
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px]">
                      ↗
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* Publications */}
        <section className="py-10 grid md:grid-cols-[1.2fr,1.1fr] gap-10 items-center">
          <div>
            <p className="text-xs tracking-[0.23em] uppercase text-orange-500 font-semibold mb-2">
              Get publications
            </p>
            <h2 className="text-2xl font-extrabold mb-2">
              Get <span className="text-orange-500">Publications</span> from
              best authors around the globe
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Access curated ebooks, research papers and guides written by
              renowned experts to support your continuous learning journey.
            </p>
            <button className="px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold shadow hover:bg-orange-600">
              Explore library
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Recent Publications</h3>
              <button className="text-[11px] font-semibold text-orange-500">
                See all
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["Future of Work", "Data Report", "Design Principles", "Tech Trends"].map(
                (pub) => (
                  <div
                    key={pub}
                    className="bg-white rounded-3xl p-2 shadow-sm border border-orange-100"
                  >
                    <div className="h-20 rounded-2xl bg-gradient-to-tr from-slate-700 via-slate-900 to-black mb-1" />
                    <div className="text-[11px] font-semibold line-clamp-2">
                      {pub}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-10">
          <h2 className="text-lg md:text-xl font-bold mb-5">
            What Our <span className="text-orange-500">Students</span> Say About Us
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {[
              {
                name: "Ayesha",
                role: "Design student",
                text: "The platform is very easy to use and the mentors are super helpful. I landed my first internship within 3 months."
              },
              {
                name: "Ali",
                role: "Developer",
                text: "Course content is up to date and full of practical examples. The projects made my portfolio stand out."
              },
              {
                name: "Sara",
                role: "Marketer",
                text: "Live classes and recordings helped me learn at my own pace. Highly recommended for working professionals."
              }
            ].map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-3xl p-4 shadow-sm border border-orange-100 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center text-xs font-bold">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[13px]">{item.name}</div>
                    <div className="text-[11px] text-gray-500">{item.role}</div>
                  </div>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#151515] text-gray-300 mt-8 pt-10 pb-6">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm">
                M
              </div>
              <span className="font-bold text-sm text-white">MKS Academy</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-4">
              A modern learning management system for students, teachers and
              professionals across the world.
            </p>
            <div className="flex gap-3 text-[11px]">
              <span>Facebook</span>
              <span>Twitter</span>
              <span>LinkedIn</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li>About us</li>
              <li>Contact</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li>Help center</li>
              <li>FAQs</li>
              <li>Terms &amp; conditions</li>
              <li>Privacy policy</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              Stay up to date
            </h4>
            <p className="text-[11px] text-gray-400 mb-3">
              Subscribe to get our latest news and offers.
            </p>
            <form className="flex flex-col gap-2 text-[11px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full border border-gray-700 bg-[#202020] px-3 py-2 text-[11px] outline-none focus:ring-1 focus:ring-orange-500 text-gray-100"
              />
              <button className="w-full px-4 py-2 rounded-full bg-orange-500 text-white text-[11px] font-semibold hover:bg-orange-600">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-8 border-t border-gray-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <span>© {new Date().getFullYear()} MKS Academy. All rights reserved.</span>
          <span>Designed for your LMS project.</span>
        </div>
      </footer>
    </div>
  );
}
