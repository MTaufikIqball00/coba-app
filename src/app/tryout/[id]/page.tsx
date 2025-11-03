"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TRYOUT_DATA } from "../../constants/tryoutdata";
import Quiz from "../../components/Quiz";
import TryoutResults from "../../components/TryoutResults";

export default function TryoutQuizPage() {
  const params = useParams() as { id: string };
  const router = useRouter();

  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const tryout = TRYOUT_DATA.find((t) => t.id === params.id);

  const handleQuizComplete = (finalAnswers: { [key: string]: string }) => {
    setAnswers(finalAnswers);
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setIsCompleted(false);
  };

  if (!tryout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-red-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Tryout Tidak Ditemukan
          </h1>
          <button
            onClick={() => router.push("/tryout")}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Kembali ke Tryout Center
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <TryoutResults
        questions={tryout.questions}
        answers={answers}
        onRestart={handleRestart}
        title={tryout.title}
      />
    );
  }

  return (
    <Quiz
      questions={tryout.questions.map((q) => ({ ...q, id: String(q.id) }))}
      title={tryout.title}
      onComplete={handleQuizComplete}
    />
  );
}
