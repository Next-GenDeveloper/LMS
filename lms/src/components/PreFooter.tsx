// src/components/PreFooter.tsx
"use client";
import Link from "next/link";
import { useState } from "react";

const testimonials = [
  {
    name: "Ayesha Khan",
    role: "Frontend Developer",
    text: "The courses are practical and easy to follow. I landed my first dev role after completing two tracks.",
    avatar: "A",
    rating: 5,
  },
  {
    name: "Muhammad Ali",
    role: "CS Student",
    text: "The courses explain concepts really well. The progress tracking and quizzes kept me motivated!",
    avatar: "M",
    rating: 5,
  },
  {
    name: "Sara Ahmed",
    role: "UI/UX Designer",
    text: "Love the clean interface and bite‑sized lessons. The design courses boosted my portfolio.",
    avatar: "S",
    rating: 4,
  },
];

const achievements = [
  { number: "50K+", label: "Active Learners" },
  { number: "200+", label: "Courses Available" },
  { number: "95%", label: "Completion Rate" },
  { number: "4.8/5", label: "Average Rating" },
];

const trustBadges = [
  { name: "SSL Secured", icon: "🔒" },
  { name: "Award Winning", icon: "🏆" },
  { name: "Certified Platform", icon: "✅" },
  { name: "24/7 Support", icon: "🛠️" },
];

const partners = [
  { name: "TechCorp", logo: "T" },
  { name: "EduHub", logo: "E" },
  { name: "LearnPro", logo: "L" },
  { name: "SkillUp", logo: "S" },
];

export default function PreFooter() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-orange-50 py-16 sm:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffd1a1,transparent_55%),radial-gradient(circle_at_bottom_right,#ffb46b,transparent_60%)]" />
      </div>

      <div className="relative container mx-auto px-6">
        {/* Achievements Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {achievements.map((achievement, idx) => (
            <div
              key={achievement.label}
              className="text-center group animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
            >
              <div className="text-3xl md:text-4xl font-extrabold text-orange-500 mb-2 group-hover:scale-110 transition-transform duration-300">
                {achievement.number}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                {achievement.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials and Trust Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Testimonials */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
                What Our Learners Say
              </h3>
              <p className="text-slate-600">
                Real stories from students who transformed their careers with our platform.
              </p>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-slate-500">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">"{testimonials[currentTestimonial].text}"</p>
                <div className="flex text-orange-400">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === currentTestimonial ? 'bg-orange-500 scale-125' : 'bg-slate-300 hover:bg-orange-300'
                    }`}
                    aria-label={`View testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
                Trusted & Certified
              </h3>
              <p className="text-slate-600">
                Your learning journey is secure and backed by industry standards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {trustBadges.map((badge, idx) => (
                <div
                  key={badge.name}
                  className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md hover:scale-105 transition-all duration-300 text-center group"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
                >
                  <div className="text-2xl mb-2 group-hover:animate-bounce">{badge.icon}</div>
                  <div className="text-sm font-semibold text-slate-700">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              Trusted by Leading Companies
            </h3>
            <p className="text-slate-600">
              Join professionals from top organizations who choose 9tangle for their learning needs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {partners.map((partner, idx) => (
              <div
                key={partner.name}
                className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md hover:scale-105 transition-all duration-300 text-center min-w-[120px]"
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
              >
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg">
                  {partner.logo}
                </div>
                <div className="text-sm font-semibold text-slate-700">{partner.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of learners who are building skills, advancing careers, and achieving their goals with 9tangle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-full shadow-lg hover:bg-orange-50 transition-all duration-300 hover:scale-105"
            >
              Start Learning Today
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
