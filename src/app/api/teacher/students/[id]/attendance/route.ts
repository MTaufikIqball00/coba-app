import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import pool from "../../../../../../lib/db";

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

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows]: [any[], any] = await connection.query(
      "SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC",
      [id]
    );

    const attendance = rows.map((row: any) => ({
      id: row.id.toString(),
      studentId: row.student_id,
      date: row.date,
      status: row.status,
      subject: row.subject,
      checkInTime: "08:00:00", // Placeholder
      location: "Classroom", // Placeholder
      notes: "-" // Placeholder
    }));

    // Statistics
    const total = attendance.length;
    const present = attendance.filter((a: any) => a.status === "present").length;
    const late = attendance.filter((a: any) => a.status === "late").length;
    const absent = attendance.filter((a: any) => a.status === "absent").length;

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

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
