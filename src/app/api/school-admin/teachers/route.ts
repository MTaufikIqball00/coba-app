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

        // Get School ID (from session or user record)
        let schoolId = session.schoolId;
        if (!schoolId) {
            const [userRows]: [any[], any] = await connection.query("SELECT school_id FROM users WHERE id = ?", [session.id]);
            if (userRows.length > 0) schoolId = userRows[0].school_id;
        }

        if (!schoolId) return NextResponse.json([], { status: 200 }); // Or 404

        // Fetch teachers joined with users
        const [rows]: [any[], any] = await connection.query(`
        SELECT t.*, u.name, u.email, u.status, u.avatar 
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE u.school_id = ?
    `, [schoolId]);

        const teachers = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            subject: row.subjects || "Umum", // Assuming subjects column exists, fallback
            classes: row.classes ? JSON.parse(row.classes) : [], // Assuming stored as JSON string or handle text
            teachingHours: row.teaching_hours || 0,
            status: row.status === 'active' ? 'Active' : 'Non-Active',
            email: row.email
        }));

        return NextResponse.json(teachers);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session || !['admin_sekolah'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // Implement creation logic (User + Teacher record) if needed
    // For now, return error or implement partially
    return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
}
