import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'admin_sekolah') {
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

        const [rows]: [any[], any] = await connection.query("SELECT * FROM users WHERE school_id = ? AND role = 'kepala_sekolah'", [schoolId]);
        return NextResponse.json(rows);

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request: NextRequest) {
    // Similar to creating user but fixed role
    const session = await getSession();
    if (!session || session.role !== 'admin_sekolah') return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await request.json();
    let connection;
    try {
        connection = await pool.getConnection();
        let schoolId = session.schoolId;
        if (!schoolId && session.id) {
            const [userRows]: [any[], any] = await connection.query("SELECT school_id FROM users WHERE id = ?", [session.id]);
            if (userRows.length > 0) schoolId = userRows[0].school_id;
        }

        const id = `user-${Date.now()}`;
        await connection.query(
            "INSERT INTO users (id, name, email, password, role, school_id, status, avatar) VALUES (?, ?, ?, ?, 'kepala_sekolah', ?, ?, '/assets/Avatar.png')",
            [id, data.name, data.email, 'password123', schoolId, data.status]
        );
        return NextResponse.json({ message: "Headmaster created" });
    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
// Implement PUT/DELETE similarly if needed, for brevity skipping for now or can implement if requested.
