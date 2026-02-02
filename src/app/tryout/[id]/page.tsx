"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import Quiz from "../../components/Quiz";
import TryoutResults from "../../components/TryoutResults";
import { QuizResultss } from "../../types/quizdata";

export default function TryoutQuizPage() {
  const params = useParams() as { id: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tryout, setTryout] = useState<any>(null); // Using any temporarily to avoid deep type matching, or import Tryout type
  const [isCompleted, setIsCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!params.id) return;

    const fetchTryout = async () => {
      try {
        const res = await fetch(`/api/tryout/${params.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setTryout(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTryout();
  }, [params.id]);

  const handleQuizComplete = (results: QuizResultss) => {
    // Convert Array of answers to Map for TryoutResults if needed, or update TryoutResults to accept QuizResultss
    // For now, assuming TryoutResults needs { [key: string]: string } map of questionId -> answer
    // But QuizResultss returns an array of answers by index.

    // Mapping array answers to question IDs if possible, or just using index as key
    const answerMap: { [key: string]: string } = {};
    results.answers.forEach((ans, idx) => {
      if (ans) {
        // Use question ID if available, else index
        // With API data, questions should be present
        const qId = tryout?.questions?.[idx]?.id ? String(tryout.questions[idx].id) : String(idx);
        answerMap[qId] = ans;
      }
    });

    setAnswers(answerMap);
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setIsCompleted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        Loading...
      </div>
    );
  }

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
      questions={tryout.questions.map((q: any) => ({ ...q, id: String(q.id) }))}
      title={tryout.title}
      onComplete={handleQuizComplete}
    />
  );
}
