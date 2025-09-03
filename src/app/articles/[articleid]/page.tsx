"use client"
import Link from "next/link";
import { use } from "react";
interface NewsArticleProps {
  params: { articleid: string };
  searchParams?: { lang?: "en" | "id" };
}

export default function NewsArticle({ params, searchParams }: NewsArticleProps) {
  const { articleid } =  params;
  const lang = searchParams?.lang ?? "id";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
        News Article #{articleid}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Reading in{" "}
        <span className="font-semibold text-blue-600 capitalize">
          {lang === "en" ? "English" : "Bahasa"}
        </span>
      </p>

      <div className="flex gap-4">
        <Link
          href={`/articles/${articleid}?lang=en`}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            lang === "en"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          English
        </Link>
        <Link
          href={`/articles/${articleid}?lang=id`}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            lang === "id"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Bahasa
        </Link>
      </div>
    </div>
  );
}
