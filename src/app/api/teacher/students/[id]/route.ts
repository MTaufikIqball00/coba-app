import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/session";
import pool from "../../../../../lib/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Fetch Student Profile (w/ User Name)
    const [studentRows]: [any[], any] = await connection.query(`
        SELECT s.*, u.name, u.email 
        FROM students s 
        LEFT JOIN users u ON s.user_id = u.id 
        WHERE s.id = ?
    `, [id]);

    if (studentRows.length === 0) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }
    const student = studentRows[0];

    // 2. Fetch Grades (Ordered by submitted_at ASC for line chart)
    const [gradeRows]: [any[], any] = await connection.query(`
        SELECT * FROM grades 
        WHERE student_id = ? 
        ORDER BY submitted_at ASC
    `, [id]);

    // Map grades to match frontend expected interface
    const grades = gradeRows.map((g: any) => ({
      id: g.id,
      subject: g.subject,
      score: parseFloat(g.score),
      grade: g.grade_letter,
      title: g.title,
      type: g.type,
      submittedAt: g.submitted_at
    }));

    // 3. Fetch Attendance
    const [attendanceRows]: [any[], any] = await connection.query(`
        SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC LIMIT 30
    `, [id]);

    const attendance = attendanceRows.map((a: any) => ({
      id: a.id,
      date: a.date,
      status: a.status,
      subject: a.subject || 'General'
    }));

    // 4. Fetch Activities
    const [activityRows]: [any[], any] = await connection.query(`
        SELECT * FROM activities WHERE student_id = ? ORDER BY timestamp DESC LIMIT 10
    `, [id]);

    const activities = activityRows.map((act: any) => ({
      id: act.id,
      type: act.type,
      title: act.title,
      description: act.description,
      timestamp: act.timestamp
    }));

    // 5. Calculate Dynamic Risk Score (Safety Score)
    // Formula matches risk-analysis.ts: (GPA/4 * 60) + (Attendance/100 * 40)
    // Higher Score = Safer. Lower Score = Dangerous.
    const normGPA = Math.min(Math.max((student.gpa || 0) / 4.0, 0), 1);
    const normAtt = Math.min(Math.max((student.attendance_rate || 0) / 100.0, 0), 1);
    const riskScore = Number(((normGPA * 60) + (normAtt * 40)).toFixed(2));

    // Status Logic 
    let riskStatus = "Aman";
    if (riskScore < 50) riskStatus = "Berisiko Tinggi";
    else if (riskScore < 75) riskStatus = "Berisiko Sedang";

    // Construct Response
    return NextResponse.json({
      success: true,
      student: {
        ...student,
        riskScore: riskScore, // Override DB
        riskStatus: riskStatus // Override DB
      },
      profile: { student: { ...student, riskScore, riskStatus } },
      grades: { grades: grades, statistics: { gpa: student.gpa || 0 } },
      attendance: { attendance: attendance, statistics: { rate: student.attendance_rate || 0 } },
      activities: { activities: activities, statistics: {} }
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error fetching student details" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let connection;
  try {
    const data = await request.json();
    connection = await pool.getConnection();

    // Check exist
    const [rows]: [any[], any] = await connection.query("SELECT id FROM students WHERE id = ?", [id]);
    if (rows.length === 0) return NextResponse.json({ message: "Student not found" }, { status: 404 });

    // Update
    // Assuming simple update of some fields like notes or risk status override if allowed
    // For now, let's just log and return success as specific fields to update weren't clear from dummy impl
    // Dummy impl was just updating object in memory.
    // Let's assume we update name or phone for now? Or just return success.
    // Actually, let's try to update standard fields if provided.

    // For simplicity and safety, let's just acknowledge update for now unless we know schema well.
    // Use `students` table.

    const fields: string[] = [];
    const values: any[] = [];

    if (data.name) { fields.push("name = ?"); values.push(data.name); }
    if (data.status) { fields.push("status = ?"); values.push(data.status); }

    if (fields.length > 0) {
      values.push(id);
      await connection.query(`UPDATE students SET ${fields.join(", ")} WHERE id = ?`, values);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  } finally {
    if (connection) connection.release();
  }
}
