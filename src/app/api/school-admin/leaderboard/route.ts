import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || !['admin_sekolah', 'headmaster', 'teacher', 'student'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        let schoolId = session.schoolId;
        if (!schoolId && session.id) {
            const [userRows]: [any[], any] = await connection.query("SELECT school_id FROM users WHERE id = ?", [session.id]);
            if (userRows.length > 0) schoolId = userRows[0].school_id;
        }

        if (!schoolId) return NextResponse.json([], { status: 200 });

        // Calculate score: 60% Avg Grade + 40% Activity Level
        // Activity Level: Count of activities in last 30 days? Or just total count?
        // Let's us total count of activities for now.

        // Get students with their avg grade and activity count
        // This query might be heavy, so limit to top 20 candidates then sort in JS or optimized SQL.
        // Normalized score: Grade is 0-100. Activity count is number.
        // Need to normalize activity count. Let's assume max activity is 100 for normalization or just add raw count * multiplier.
        // The previous dummy logic: student.averageScore * 0.6 + student.activityLevel * 0.4;
        // We'll approximate: Avg Grade (0-100) * 0.6 + (Activity Count * 2) * 0.4 (capped?)

        // SQL to get stats per student
        const [rows]: [any[], any] = await connection.query(`
        SELECT 
            s.id, s.name, s.class as className,
            COALESCE(AVG(g.score), 0) as avgScore,
            (SELECT COUNT(*) FROM activities a WHERE a.student_id = s.id) as activityCount
        FROM students s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN grades g ON s.id = g.student_id
        WHERE u.school_id = ?
        GROUP BY s.id
    `, [schoolId]);

        const scoredStudents = rows.map((row: any) => {
            const avgScore = parseFloat(row.avgScore);
            const activityCount = parseInt(row.activityCount);
            // Heuristic: Activity Count * 5 (assuming 20 activities = 100 score equivalent) capped at 100
            const activityScore = Math.min(activityCount * 5, 100);

            const combinedScore = (avgScore * 0.6) + (activityScore * 0.4);

            return {
                id: row.id,
                name: row.name,
                class: row.className, // 'class' is reserved keyword sometimes, use className
                averageScore: avgScore,
                activityLevel: activityScore,
                combinedScore: combinedScore
            };
        });

        // Sort descending
        scoredStudents.sort((a: any, b: any) => b.combinedScore - a.combinedScore);

        // Top 10
        return NextResponse.json(scoredStudents.slice(0, 10));

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
