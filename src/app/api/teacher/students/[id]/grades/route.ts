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
      "SELECT * FROM grades WHERE student_id = ? ORDER BY submitted_at DESC",
      [id]
    );

    const grades = rows.map((row: any) => ({
      id: row.id.toString(),
      studentId: row.student_id,
      subject: row.subject,
      type: row.type,
      title: row.title,
      score: parseFloat(row.score),
      maxScore: 100, // Default
      percentage: parseFloat(row.score),
      grade: row.score >= 90 ? "A" : row.score >= 80 ? "B" : "C", // Basic logic
      submittedAt: row.submitted_at,
      gradedAt: row.submitted_at // fallback
    }));

    // Simulate some statistics
    const averageScore = grades.length > 0
      ? grades.reduce((acc: number, g: any) => acc + g.score, 0) / grades.length
      : 0;

    const statistics = {
      averageScore,
      highestGrade: "A", // Placeholder
      lowestGrade: "B-", // Placeholder
    };

    return NextResponse.json({
      success: true,
      grades,
      statistics,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
