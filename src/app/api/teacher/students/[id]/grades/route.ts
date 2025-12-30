import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import { dummyGrades } from "../../../../../../lib/dummy-data";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const grades = dummyGrades.get(id) || [];

  // Simulate some statistics
  const statistics = {
    averageScore:
      grades.reduce((acc, g) => acc + g.score, 0) / (grades.length || 1),
    highestGrade: "A",
    lowestGrade: "B-",
  };

  return NextResponse.json({
    success: true,
    grades,
    statistics,
  });
}
