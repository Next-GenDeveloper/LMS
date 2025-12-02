import CourseCard, { Course } from "@/components/CourseCard";

const demoCourses: Course[] = [
  {
    id: "c1",
    title: "React for Beginners",
    description: "Build interactive UIs with modern React and hooks.",
    imageUrl: "/next.svg",
    price: 1499,
    author: "Admin",
    progress: 25,
  },
  {
    id: "c2",
    title: "TypeScript Mastery",
    description: "Type-safe apps with TypeScript generics, utility types and best practices.",
    imageUrl: "/vercel.svg",
    price: 1999,
    author: "Admin",
    progress: 60,
  },
  {
    id: "c3",
    title: "Node.js APIs",
    description: "Build secure and scalable APIs using Express and Prisma.",
    imageUrl: "/globe.svg",
    price: 2499,
    author: "Admin",
  },
];

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {demoCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
