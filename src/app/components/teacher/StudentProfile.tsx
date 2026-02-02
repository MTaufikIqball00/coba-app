import Image from "next/image";
import { FiMail, FiPhone } from "react-icons/fi";
import { Student } from "../../../lib/types/student";

interface StudentProfileProps {
  student: Student;
}

export default function StudentProfile({ student }: StudentProfileProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Kolom 1: Profil Utama */}
      <div className="lg:col-span-2 backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-6">
          {student.avatar ? (
            <Image
              src={student.avatar}
              alt={student.name}
              width={128}
              height={128}
              className="rounded-full border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-500">
              No Avatar
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold text-slate-800">{student.name}</h1>
            <p className="text-lg text-slate-600">{student.major}</p>
            <div className="flex gap-4 mt-4 text-slate-500">
              <span className="flex items-center gap-2">
                <FiMail /> {student.email}
              </span>
              <span className="flex items-center gap-2">
                <FiPhone /> {student.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kolom 2: Analisis Risiko (AI) */}
      <div className={`backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl flex flex-col justify-center
        ${student.riskStatus === 'Berisiko Tinggi' ? 'bg-red-50/80 border-red-200' :
          student.riskStatus === 'Berisiko Sedang' ? 'bg-yellow-50/80 border-yellow-200' :
            'bg-green-50/80 border-green-200'
        }`}>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Analisis Risiko Siswa (AI)</h3>

        <div className="flex items-center gap-3 mb-4">
          {student.riskStatus === 'Berisiko Tinggi' && <span className="text-4xl">⚠️</span>}
          {student.riskStatus === 'Berisiko Sedang' && <span className="text-4xl">🚧</span>}
          {(!student.riskStatus || student.riskStatus === 'Aman') && <span className="text-4xl">✅</span>}

          <div>
            <div className="text-2xl font-bold">
              {student.riskStatus || 'Belum Dianalisis'}
            </div>
            <div className="text-sm text-slate-500">
              AI Prediction Score: {student.riskScore ? student.riskScore.toFixed(2) : '-'}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 italic border-t pt-2 border-slate-200/50">
          {student.rekomendasi ? student.rekomendasi : (
            <>
              {student.riskStatus === 'Berisiko Tinggi' && "Siswa ini menunjukkan tren penurunan nilai yang signifikan. Perlu intervensi segera."}
              {student.riskStatus === 'Berisiko Sedang' && "Prestasi siswa stagnan atau mendekati batas KKM. Perlu pemantauan."}
              {(!student.riskStatus || student.riskStatus === 'Aman') && "Prestasi siswa stabil atau meningkat. Pertahankan."}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
