import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";
import { analyzeStudentRisk } from "../../../../lib/utils/risk-analysis";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Fetch students with user details
    // Assuming we want all students for now, or filtered by teacher's class?
    // For now, fetching all students to simulate "Teacher Dashboard for the School"
    // Ideally should filter by school_id if teacher belongs to a school.
    // But session might not have schoolId? checking session structure from login... yes it has school.id.

    let query = `
        SELECT s.*, u.name, u.email, u.avatar, sc.name as school_name, sc.province as school_province 
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN schools sc ON u.school_id = sc.id
      `;
    // If session has school, filter? leaving as all for now as requested "migrate all".

    const [rows]: [any[], any] = await connection.query(query);

    const studentsArray: any[] = rows.map((row: any) => ({
      id: row.id,
      studentId: row.nisn || row.id,
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      grade: parseInt(row.class_name?.split('-')[0]) || 10,
      class: row.class_name,
      school: {
        name: row.school_name,
        province: row.school_province
      },
      status: row.status,
      gpa: parseFloat(row.gpa) || 0,
      attendanceRate: parseFloat(row.attendance_rate) || 0,
      averageScore: parseFloat(row.average_score) || 0,
      activityLevel: row.activity_level || 0,
      // Mocked/Default fields to satisfy Student interface
      semester: row.semester || 1,
      phone: "081234567890",
      major: row.major || "Umum",
      enrollmentDate: row.created_at || new Date().toISOString(),
      totalCredits: 0,
      completedCredits: 0,
      address: row.address || "",
      parentName: "",
      parentPhone: "",
      assignmentCompletion: 0,
      quizAverage: 0,
      createdAt: row.created_at,
      updatedAt: row.created_at,
      riskStatus: "Aman", // Will be overwritten by analyzeStudentRisk
      riskScore: 0
    }));

    // Perform Risk Analysis
    const { students: enrichedStudents, stats } = analyzeStudentRisk(studentsArray);

    return NextResponse.json({
      success: true,
      total: enrichedStudents.length,
      students: enrichedStudents,
      stats: stats,
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
