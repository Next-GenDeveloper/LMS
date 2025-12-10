"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CourseContentPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();

  useEffect(() => {
    // This page is just a placeholder - the layout handles all the content
    // Redirect to the course detail page if accessed directly
    router.replace(`/courses/${params.courseId}`);
  }, [params.courseId, router]);

  return null;
}