import { StudentGrade } from "../../../lib/types/student";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StudentGradeProps {
  data: StudentGrade[] | undefined;
}

export default function StudentGradeComponent({ data }: StudentGradeProps) {
  // Format data for the chart
  const chartData = data?.map((grade) => ({
    name: grade.title, // Use title for X-axis label
    score: grade.score, // Use score for Y-axis
    subject: grade.subject,
  }));

  return (
    <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Riwayat Nilai</h2>

      {data && data.length > 0 ? (
        <div className="space-y-8">
          {/* Chart Section */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* List Section */}
          <div className="grid gap-4">
            {data.map((grade) => (
              <div
                key={grade.id}
                className="bg-white/60 rounded-xl p-4 flex justify-between items-center border border-white/40 hover:bg-white/80 transition-colors"
              >
                <div>
                  <p className="font-bold text-slate-800">
                    {grade.subject} - {grade.title}
                  </p>
                  <p className="text-sm text-slate-500">
                    {grade.type} • {new Date(grade.submittedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-lg font-bold px-3 py-1 rounded-lg ${
                      grade.score > 80
                        ? "bg-green-100 text-green-700"
                        : grade.score > 60
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {grade.score}
                  </span>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Grade: {grade.grade}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
          <p>Belum ada data nilai untuk ditampilkan.</p>
        </div>
      )}
    </div>
  );
}
