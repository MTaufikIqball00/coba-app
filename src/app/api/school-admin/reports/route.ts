import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || !['admin_sekolah', 'headmaster'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        let schoolId = session.schoolId;
        if (!schoolId) {
            const [userRows]: [any[], any] = await connection.query("SELECT school_id FROM users WHERE id = ?", [session.id]);
            if (userRows.length > 0) schoolId = userRows[0].school_id;
        }

        if (!schoolId) return NextResponse.json([], { status: 200 });

        // 1. Get List of Classes
        const [classRows]: [any[], any] = await connection.query(`
        SELECT DISTINCT class FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE u.school_id = ?
        ORDER BY class
    `, [schoolId]);

        const reports = [];

        for (const clsRow of classRows) {
            const className = clsRow.class;

            // 2. Calculate Average Grade for Class
            // Assuming courses table has details, grades linked to courses
            // We need to join grades -> courses? Or grades -> assignments -> courses?
            // Let's assume grades table has score, and maybe linked to course directly or via something else.
            // Based on schema from memory: grades (id, student_id, course_id, score...)

            const [gradeRows]: [any[], any] = await connection.query(`
            SELECT AVG(g.score) as avg_score
            FROM grades g
            JOIN students s ON g.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE u.school_id = ? AND s.class = ?
        `, [schoolId, className]);

            const avgGrade = parseFloat(gradeRows[0].avg_score) || 0;

            // 3. Calculate Attendance Rate
            // attendance (id, student_id, status...) 'present'
            // Rate = (Count Present / Count Total) * 100
            const [attRows]: [any[], any] = await connection.query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE u.school_id = ? AND s.class = ?
        `, [schoolId, className]);

            const totalAtt = attRows[0].total;
            const presentAtt = attRows[0].present;
            const attendanceRate = totalAtt > 0 ? (presentAtt / totalAtt) * 100 : 0;

            // 4. Subject Breakdown
            // Group avg score by course/subject
            const [subjectRows]: [any[], any] = await connection.query(`
            SELECT c.name as subject, AVG(g.score) as average
            FROM grades g
            JOIN courses c ON g.course_id = c.id
            JOIN students s ON g.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE u.school_id = ? AND s.class = ?
            GROUP BY c.name
        `, [schoolId, className]);

            const subjectBreakdown = subjectRows.map((row: any) => ({
                subject: row.subject,
                average: parseFloat(row.average) || 0
            }));

            reports.push({
                class: className,
                averageGrade: avgGrade,
                attendanceRate: attendanceRate,
                graduationRate: null, // Hard to calc without rules
                subjectBreakdown
            });
        }

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
