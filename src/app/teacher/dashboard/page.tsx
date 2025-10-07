import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import TeacherDashboard from "../../components/admin/TeacherDashboard";

export default async function TeacherDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  const dashboardStats = {
    activeAssignments: 12,
    assignmentCompletion: "85%",
    totalModules: 24,
    modulesViewed: 156,
    verifiedAttendance: 89,
    pendingAttendance: 5,
    totalQuizzes: 18,
    avgQuizScore: "78%",
  };

  return <TeacherDashboard session={session} stats={dashboardStats} />;
}