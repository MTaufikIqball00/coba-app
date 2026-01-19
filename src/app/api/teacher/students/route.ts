import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { dummyStudents } from "../../../../lib/dummy-data";
import { analyzeStudentRisk } from "../../../../lib/utils/risk-analysis";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Convert Map values to an array
  const studentsArray = Array.from(dummyStudents.values());

  // Perform Risk Analysis
  const { students: enrichedStudents, stats } = await analyzeStudentRisk(studentsArray);

  return NextResponse.json({
    success: true,
    total: enrichedStudents.length,
    students: enrichedStudents,
    stats: stats,
  });
}
