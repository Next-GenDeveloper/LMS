export type ApiCourse = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  bannerImage?: string;
  pdfFiles?: string[];
  videoFiles?: string[];
  category: string;
  level?: string;
  duration?: number;
  language?: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
  enrollmentCount?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getCourses(): Promise<ApiCourse[]> {
  const { apiFetch } = await import("@/lib/api");
  try {
    const courses = await apiFetch<any[]>("/api/courses");
    return courses.map((c: any) => ({
      id: c.id || c._id,
      title: c.title,
      description: c.description,
      price: c.price || 0,
      thumbnail: c.bannerImage || c.thumbnail || '/next.svg',
      bannerImage: c.bannerImage || c.thumbnail,
      pdfFiles: c.pdfFiles || [],
      videoFiles: c.videoFiles || [],
      category: c.category || 'General',
      level: c.level,
      duration: c.duration,
      language: c.language,
      tags: c.tags,
      rating: c.rating || 4.5,
      reviews: c.reviews || 0,
      enrollmentCount: c.enrollmentCount || 0,
      isPublished: c.isPublished ?? true,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  } catch (e) {
    // Fallback to mock data if backend is down, so preview keeps working
    console.warn('getCourses failed, using mock list', e);
    return [
      {
        id: 'demo-1',
        title: 'Intro to React',
        description: 'Build interactive UIs with modern React and hooks.',
        price: 1499,
        thumbnail: '/next.svg',
        category: 'Web Development',
        level: 'beginner',
        rating: 4.5,
        reviews: 120,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-2',
        title: 'TypeScript Mastery',
        description: 'Type-safe apps with generics, utility types and best practices.',
        price: 1999,
        thumbnail: '/vercel.svg',
        category: 'Programming Languages',
        level: 'intermediate',
        rating: 4.7,
        reviews: 85,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'demo-3',
        title: 'Node.js APIs',
        description: 'Build secure and scalable APIs using Express and Mongoose.',
        price: 2499,
        thumbnail: '/globe.svg',
        category: 'Backend',
        level: 'advanced',
        rating: 4.8,
        reviews: 200,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}
