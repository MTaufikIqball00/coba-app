import { StudentGrade } from "../../../lib/types/student";

interface StudentGradeProps {
  data: StudentGrade[] | undefined; // Ubah dari object ke array
}

export default function StudentGradeComponent({ data }: StudentGradeProps) {
  return (
    <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Nilai</h2>
      {data && data.length > 0 ? ( // Langsung cek data.length
        <ul>
          {data.map(
            (
              grade // Langsung map data
            ) => (
              <li key={grade.id} className="border-b py-2 last:border-none">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {grade.subject} - {grade.title}
                    </p>
                    <p className="text-sm text-slate-500">Tipe: {grade.type}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-bold ${
                        grade.score > 80 ? "text-green-600" : "text-orange-600"
                      }`}
                    >
                      {grade.score}/{grade.maxScore}
                    </p>
                    <p className="text-md font-semibold text-slate-700">
                      Grade: {grade.grade}
                    </p>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>Tidak ada data nilai untuk ditampilkan.</p>
      )}
    </div>
  );
}
