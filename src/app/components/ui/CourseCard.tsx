import Image from "next/image";
import Link from "next/link";
import { Course } from "../../types/dashboard";

interface CourseCardProps {
  course: Course;
  priority?: boolean;
}

export default function CourseCard({
  course,
  priority = false,
}: CourseCardProps) {
  return (
    <article className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-32 bg-gray-100">
        <Image
          src={course.image}
          alt={`${course.title} course thumbnail`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={priority}
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-black text-lg mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <Link
          href={`/courses/${course.slug}`}
          className="inline-block border border-blue-700 text-blue-700 rounded-xl px-4 py-2 text-sm hover:bg-blue-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}
