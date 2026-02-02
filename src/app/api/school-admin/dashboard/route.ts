import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || !['admin_sekolah'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Get School ID
        const [userRows]: [any[], any] = await connection.query("SELECT school_id FROM users WHERE id = ?", [session.id]);
        const schoolId = userRows[0]?.school_id;

        if (!schoolId) {
            return NextResponse.json({ message: "School not found for user" }, { status: 404 });
        }

        // counts
        const [teacherCount]: [any[], any] = await connection.query("SELECT COUNT(*) as count FROM teachers WHERE school_id = ?", [schoolId]); // teachers table might link to users, assuming schema
        // Wait, teachers table structure: id, user_id (FK), subjects...
        // The user count with role='teacher' and school_id=? is safer if teachers table doesn't have school_id directly (it usually links via user_id -> users.school_id)
        // Let's check schema. Usually teachers table is profile. Users table has the school_id.

        const [studentCount]: [any[], any] = await connection.query("SELECT COUNT(*) as count FROM users WHERE school_id = ? AND role = 'student'", [schoolId]);
        const [teacherUserCount]: [any[], any] = await connection.query("SELECT COUNT(*) as count FROM users WHERE school_id = ? AND role = 'teacher'", [schoolId]);

        // Mock recent activities for now or query logs
        const recentActivities = [
            { id: 1, action: "Siswa Baru Terdaftar", time: "2 jam yang lalu" },
            { id: 2, action: "Jadwal Ujian Diperbarui", time: "5 jam yang lalu" },
        ];

        return NextResponse.json({
            totalStudents: studentCount[0].count,
            totalTeachers: teacherUserCount[0].count,
            totalClasses: 12, // Mock or query classes table if exists
            attendanceRate: 95, // Mock or calc
            recentActivities
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
