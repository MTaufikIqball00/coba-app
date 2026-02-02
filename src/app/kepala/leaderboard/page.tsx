"use client";
import React, { useState, useEffect } from "react";

interface StudentScore {
  id: string;
  name: string;
  class: string;
  averageScore: number;
  activityLevel: number;
  combinedScore: number;
}

const getBadge = (rank: number) => {
  if (rank === 1)
    return (
      <span className="text-xl" role="img" aria-label="Gold Medal">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="text-xl" role="img" aria-label="Silver Medal">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="text-xl" role="img" aria-label="Bronze Medal">
        🥉
      </span>
    );
  return null;
};

export default function LeaderboardPage() {
  const [students, setStudents] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/school-admin/leaderboard');
        if (res.ok) setStudents(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard Murid</h1>
          <p className="mt-1 text-md text-gray-600">
            Peringkat murid berdasarkan performa akademik dan keaktifan
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Top 10 Murid Berprestasi
            </h2>
          </div>
          {loading ? (
            <div className="p-10 text-center">Loading leaderboard...</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {students.length === 0 ? (
                <li className="p-6 text-center text-gray-500">Belum ada data.</li>
              ) : students.map((student, index) => {
                const rank = index + 1;
                const score = student.combinedScore;

                return (
                  <li
                    key={student.id}
                    className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-12 text-center">
                        <span className="text-2xl font-bold text-gray-500">
                          {rank}
                        </span>
                        <div className="mt-1">{getBadge(rank)}</div>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-semibold text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Kelas: {student.class}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600">
                        {score.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Skor Gabungan</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}