export type ApiCourse = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getCourses(): Promise<ApiCourse[]> {
  const { apiFetch } = await import("@/lib/api");
  try {
    return await apiFetch<ApiCourse[]>("/api/courses");
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
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}
