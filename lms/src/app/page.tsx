// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import heroImage from "@/upload/hero-image.jpg";

export default function Home() {
  return (
    <>
      {/* Hero - warm MKS style */}
      <section className="relative overflow-hidden bg-[#ffe9d6]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_55%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-8 md:py-10">

          <div className="mt-12 flex flex-col items-center justify-between gap-12 md:flex-row md:gap-16">
            {/* Left content */}
            <div className="max-w-xl">
              <p className="mb-4 inline-block rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                Online education platform
              </p>
              <h1 className="mb-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl lg:text-[3.3rem]">
                A Classical Education for the{" "}
                <span className="relative inline-block text-orange-500">
                  Future
                  <span className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-orange-400" />
                </span>
              </h1>
              <p className="mb-8 text-base text-slate-700 md:text-lg">
                We prepare you to engage in the world that is and to help bring about
                a world that ought to be, through flexible, high‑quality online learning.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/register"
                  className="rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/60 transition hover:bg-orange-600"
                >
                  Get started
                </Link>
                <Link
                  href="/courses"
                  className="rounded-full border border-orange-300 bg-white/70 px-7 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Browse courses
                </Link>
              </div>
            </div>

            {/* Right visual panel */}
            <div className="relative flex w-full max-w-md items-center justify-center md:max-w-lg">
              <div className="relative w-full overflow-hidden rounded-[3rem] bg-[#ffd3aa] p-4 shadow-2xl">
                <div className="flex h-full items-center justify-center rounded-[2.5rem] bg-gradient-to-t from-orange-100 via-amber-50 to-white">
                  {/* Hero image */}
                  <div className="flex h-56 w-full flex-col items-center justify-center gap-3 text-center text-sm text-orange-500">
                    <span className="rounded-[2rem] bg-white overflow-hidden shadow-lg w-full h-lg">
                      <Image
                        src={heroImage}
                        alt="Hero Image"
                        className="w-full h-full object-cover"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature highlights - Live Chat / Examination / Competition */}
      <section className="relative -mt-10 md:-mt-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "💬",
                title: "Live Chat",
                desc: "Instantly connect with instructors and peers for quick help.",
              },
              {
                icon: "📝",
                title: "Examination",
                desc: "Structured assessments to track and certify your progress.",
              },
              {
                icon: "🏅",
                title: "Competition",
                desc: "Engage in challenges and contests to sharpen your skills.",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-white shadow-sm p-6 hover:shadow-xl transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white text-xl shadow-md">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{f.title}</h3>
                    <p className="text-sm text-slate-600">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by marquee */}
     <section className="py-12">
       <div className="container mx-auto px-6">
            <div className="text-center mb-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                Trusted by teams & learners
              </div>
         </div>
         <div className="marquee rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur py-4">
           <div className="marquee-content gap-10 text-slate-500 dark:text-slate-400">
             {['Figma','Google','Shopify','Meta','Microsoft','Stripe','Amazon','Adobe','Netflix','Airbnb'].map((b) => (
               <span key={b} className="inline-flex items-center gap-2 text-sm font-medium">
                 <span className="text-lg">⭐</span> {b}
               </span>
             ))}
             {['Figma','Google','Shopify','Meta','Microsoft','Stripe','Amazon','Adobe','Netflix','Airbnb'].map((b) => (
               <span key={`${b}-dup`} className="inline-flex items-center gap-2 text-sm font-medium">
                 <span className="text-lg">⭐</span> {b}
               </span>
             ))}
           </div>
         </div>
       </div>
     </section>

      {/* Explore Our Popular Course */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-400 mb-2">
                Courses
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                Explore Our{" "}
                <span className="text-orange-500">Popular Course</span>
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-orange-600">
              <span className="text-xs">▼</span>
              Sort by
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Learn Marketing From Top Instructors.",
                img: "/images/courses/marketing.jpg",
              },
              {
                title: "Front-End Development Is Not Hard As You Think",
                img: "/images/courses/frontend.jpg",
              },
              {
                title: "Everything You Need To Know In UX",
                img: "/images/courses/ux.jpg",
              },
              {
                title: "Learn Photography With Ease",
                img: "/images/courses/photography.jpg",
              },
              {
                title: "Be A Pro In Data Analysis",
                img: "/images/courses/data.jpg",
              },
              {
                title: "Ethical Hacking Is Not Hard As You Think",
                img: "/images/courses/hacking.jpg",
              },
            ].map((course) => (
              <div
                key={course.title}
                className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="h-44 w-full bg-gray-200">
                  {/* Replace with next/image and real images when available */}
                </div>
                <div className="p-5 space-y-4">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>6 weeks</span>
                      <span className="flex items-center gap-1">
                        <span>👤</span> 1.5k Students
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500 font-semibold">
                      <span className="text-xs text-gray-500 mr-1">☆ 4.5</span>
                      <span>30.5$</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#fff7f1]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-orange-500 mb-3">What learners say</h2>
          <p className="mb-12 text-center text-base text-gray-500">Real feedback from learners who advanced their careers using our LMS.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              name: 'Ayesha',
              role: 'Front-end dev',
              body: 'The hands‑on classes boosted my confidence for job interviews.',
              img: '/next.svg',
            }, {
              name: 'Zain',
              role: 'Data Scientist',
              body: 'Course content was excellent, plus the support team is super helpful!',
              img: '/vercel.svg',
            }, {
              name: 'Faiza',
              role: 'UX Designer',
              body: 'Thanks to MKS Academy, I now work for my dream company.',
              img: '/globe.svg',
            }].map((t, i) => (
              <div
                key={t.name}
                className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center border border-orange-100 hover:shadow-2xl transition group"
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <svg
                      key={idx}
                      className="w-5 h-5 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.386-2.458a1 1 0 00-1.176 0l-3.386 2.458c-.783.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.782-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
                <div className="w-20 h-20 mb-3 rounded-full overflow-hidden border-2 border-orange-300">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="font-bold text-lg mb-1 text-slate-900">{t.name}</div>
                <div className="text-sm text-gray-500 mb-2">{t.role}</div>
                <blockquote className="italic text-[15px] text-gray-600 text-center">“{t.body}”</blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & Publications */}
      <section className="py-16 bg-[#fff2e4]">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-3xl md:text-4xl font-bold text-orange-500 mb-2">Latest Publications & Blogs</h2>
          <p className="text-center text-base text-gray-500 mb-10 max-w-xl mx-auto">Expert-written articles, tips and publications to keep you ahead in your study, career and tech journey.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                img: '/next.svg',
                tag: "Productivity",
                tagColor: "bg-green-100 text-green-700",
                title: "How to stay productive while learning",
                desc: "Strategies to focus, avoid burnout, and get results as an online learner.",
                author: '/next.svg',
                name: "Ayesha",
                date: "May 10, 2025",
              },
              {
                img: '/vercel.svg',
                tag: "News",
                tagColor: "bg-blue-100 text-blue-700",
                title: "Upcoming courses & events this summer",
                desc: "Discover the latest launches and special events from MKS Academy.",
                author: '/vercel.svg',
                name: "Academy Admin",
                date: "May 3, 2025",
              },
              {
                img: '/globe.svg',
                tag: "Inspiration",
                tagColor: "bg-orange-100 text-orange-600",
                title: "Success stories from our top learners",
                desc: "Read about real students who landed jobs and higher salaries via our platform.",
                author: '/globe.svg',
                name: "Faiza",
                date: "April 28, 2025",
              },
            ].map((b, i) => (
              <div className="bg-white rounded-3xl shadow-lg hover:shadow-orange-100 border border-orange-100 hover:border-orange-300 group overflow-hidden flex flex-col transition" key={i}>
                <div className="relative">
                  <img src={b.img} alt={b.title} className="w-full h-48 object-cover rounded-t-3xl" />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${b.tagColor}`}>{b.tag}</span>
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="text-lg font-bold mb-1 text-slate-900 group-hover:text-orange-500">{b.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{b.desc}</p>
                  <div className="mt-auto flex items-center gap-3 pt-2">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-orange-200">
                      <img src={b.author} alt={b.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-gray-700">{b.name}</div>
                      <div className="text-gray-400">{b.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA wide bar */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-0">Ready to join 50,000+ learners?</div>
            <form className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
              <input type="email" placeholder="Enter your email" className="px-5 py-3 rounded-full bg-white text-base font-medium text-orange-600 placeholder:text-orange-400 focus:ring-2 focus:ring-orange-200 outline-none border-none w-full sm:w-72" />
              <button type="submit" className="px-7 py-3 rounded-full bg-white text-orange-500 font-bold text-base shadow hover:bg-orange-100 transition min-w-[120px]">Join now</button>
            </form>
          </div>
          <div className="text-xs text-center text-orange-400 mt-2">No spam, just top learning tips.</div>
        </div>
      </section>

    </>
  );
}
