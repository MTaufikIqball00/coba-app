import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import pool from "../../../../../../lib/db";

interface RouteContext {
  params: Promise<{ id: string }>;
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
      "SELECT * FROM activities WHERE student_id = ? ORDER BY timestamp DESC",
      [id]
    );

    const activities = rows.map((row: any) => ({
      id: row.id,
      studentId: row.student_id,
      type: row.type,
      title: row.title,
      description: row.description,
      timestamp: row.timestamp,
      metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : undefined
    }));

    // Simulate some statistics
    const totalActivities = activities.length;
    const lastActivity = activities.length > 0 ? activities[0].timestamp : null;

    const statistics = {
      totalActivities,
      lastActivity,
    };

    return NextResponse.json({
      success: true,
      activities,
      statistics,
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
