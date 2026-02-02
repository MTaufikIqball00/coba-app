import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();

    // Verify Admin Access
    if (!session || !['admin_langganan', 'admin_sekolah'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.query(`
        SELECT u.*, s.name as school_name 
        FROM users u 
        LEFT JOIN schools s ON u.school_id = s.id 
        ORDER BY u.created_at DESC
    `);

        const users = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            schoolId: row.school_id,
            status: row.status,
            lastLogin: row.last_login,
            avatar: row.avatar,
            schoolName: row.school_name
        }));

        return NextResponse.json(users);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session || !['admin_langganan', 'admin_sekolah'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        // Add basic validation here
        const connection = await pool.getConnection();
        // Implement INSERT logic...
        // For brevity in this step, returning mock success or implement later if needed for full CRUD.
        // Assuming "Management" implies simple display for now, but the UI has "Tambah Pengguna".
        // Let's implement basic INSERT.

        const { name, email, role, schoolId, status } = body;
        const id = `user-${Date.now()}`;
        const password = "password123"; // Default password

        await connection.query(
            `INSERT INTO users (id, name, email, password, role, school_id, status, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, email, password, role, schoolId || null, status, '/assets/Avatar.png']
        );

        connection.release();
        return NextResponse.json({ success: true, user: { id, ...body } });
    } catch (error) {
        console.error("Create user error:", error);
        return NextResponse.json({ message: "Failed to create user" }, { status: 500 });
    }
}
