import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import { dummyAttendance } from "../../../../../../lib/dummy-data";

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

  const attendance = dummyAttendance.get(id) || [];

  // Simulate some statistics
  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "present").length;
  const late = attendance.filter((a) => a.status === "late").length;
  const absent = attendance.filter((a) => a.status === "absent").length;

  const statistics = {
    rate: total > 0 ? (present / total) * 100 : 100,
    totalPresent: present,
    totalLate: late,
    totalAbsent: absent,
  };

  return NextResponse.json({
    success: true,
    attendance,
    statistics,
  });
}
