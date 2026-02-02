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
        const [rows]: [any[], any] = await connection.query(`SELECT * FROM schools ORDER BY name ASC`);

        // Map snake_case to camelCase
        const schools = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            address: row.address,
            city: row.city,
            province: row.province,
            postalCode: row.postal_code,
            phone: row.phone,
            email: row.email,
            headmaster: row.headmaster,
            subscriptionStatus: row.subscription_status,
            registeredDate: row.registered_date,
            logo: row.logo,
            level: row.level,
            academicYear: row.academic_year,
            userCapacity: row.user_capacity
        }));

        return NextResponse.json(schools);
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
        const connection = await pool.getConnection();

        const id = `sch-${Date.now()}`;

        await connection.query(
            `INSERT INTO schools (id, name, address, city, province, postal_code, phone, email, headmaster, subscription_status, level, academic_year, user_capacity, registered_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
            [id, body.name, body.address, body.city, body.province, body.postalCode, body.phone, body.email, body.headmaster, body.subscriptionStatus, body.level, body.academicYear, body.userCapacity]
        );

        connection.release();
        return NextResponse.json({ success: true, school: { id, ...body } });
    } catch (error) {
        console.error("Create school error:", error);
        return NextResponse.json({ message: "Failed to create school" }, { status: 500 });
    }
}
