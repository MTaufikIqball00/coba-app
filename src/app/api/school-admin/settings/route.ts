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
        if (!schoolId && session.id) {
            const [userRows]: [any[], any] = await connection.query("SELECT school_id FROM users WHERE id = ?", [session.id]);
            if (userRows.length > 0) schoolId = userRows[0].school_id;
        }

        if (!schoolId) return NextResponse.json({ message: "School not found" }, { status: 404 });

        const [rows]: [any[], any] = await connection.query("SELECT * FROM schools WHERE id = ?", [schoolId]);
        if (rows.length === 0) return NextResponse.json({ message: "School not found" }, { status: 404 });

        // Normalize data keys to match frontend expectation (camelCase)
        const school = rows[0];
        const schoolData = {
            id: school.id,
            name: school.name,
            address: school.address,
            level: school.level || "SMA", // Default if missing
            status: school.status || "active",
            academicYear: school.academic_year || "2023/2024",
            userCapacity: school.user_capacity || 1000,
            logo: school.logo || "/assets/logo-sekolah.png"
        };

        return NextResponse.json(schoolData);

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function PUT(request: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'admin_sekolah') {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        const data = await request.json();
        connection = await pool.getConnection();

        let schoolId = session.schoolId;
        if (!schoolId && session.id) {
            const [userRows]: [any[], any] = await connection.query("SELECT school_id FROM users WHERE id = ?", [session.id]);
            if (userRows.length > 0) schoolId = userRows[0].school_id;
        }

        if (!schoolId) return NextResponse.json({ message: "School not found" }, { status: 404 });

        await connection.query(
            `UPDATE schools SET name = ?, address = ?, level = ?, academic_year = ?, user_capacity = ?, logo = ? WHERE id = ?`,
            [data.name, data.address, data.level, data.academicYear, data.userCapacity, data.logo, schoolId]
        );

        return NextResponse.json({ message: "Settings updated" });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
