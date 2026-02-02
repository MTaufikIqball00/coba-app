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

        // Fetch students joined with users
        const [rows]: [any[], any] = await connection.query(`
        SELECT s.*, u.name, u.email, u.status, u.avatar 
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE u.school_id = ?
    `, [schoolId]);

        const students = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            class: row.class,
            status: row.status === 'active' ? 'active' : 'inactive', // map consistency
            averageScore: 0, // Mock or calc
            activityLevel: 0, // Mock or calc
            profile: {
                nisn: row.nisn,
                gender: row.gender,
                dateOfBirth: row.date_of_birth,
                address: row.address
            }
        }));

        return NextResponse.json(students);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
