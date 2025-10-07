import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { dummyStudents } from "../../../../lib/dummy-data";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Convert Map values to an array
  const studentsArray = Array.from(dummyStudents.values());

  return NextResponse.json({
    success: true,
    total: studentsArray.length,
    students: studentsArray,
  });
}
