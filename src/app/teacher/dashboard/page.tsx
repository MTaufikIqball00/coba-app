import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import TeacherDashboard from "../../components/admin/TeacherDashboard";
import { dummyStudents } from "../../../lib/dummy-data";
import { analyzeStudentRisk } from "../../../lib/utils/risk-analysis";

export default async function TeacherDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  // Calculate dynamic risk stats
  const studentsArray = Array.from(dummyStudents.values());
  const { students } = analyzeStudentRisk(studentsArray);
  const atRiskCount = students.filter(
    (s) => s.riskStatus === "Berisiko Tinggi" || s.riskStatus === "Berisiko Sedang"
  ).length;

  const dashboardStats = {
    activeAssignments: 12,
    assignmentCompletion: "85%",
    totalModules: 24,
    modulesViewed: 156,
    verifiedAttendance: 89,
    pendingAttendance: 5,
    totalQuizzes: 18,
    avgQuizScore: "78%",
    studentsAtRisk: atRiskCount,
  };

  return <TeacherDashboard session={session} stats={dashboardStats} />;
}