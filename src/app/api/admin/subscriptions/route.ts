import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || !['admin_langganan', 'admin_sekolah'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.query(`SELECT * FROM subscriptions ORDER BY start_date DESC`);

        // CamelCase Mapping
        const subscriptions = rows.map((row: any) => ({
            id: row.id,
            schoolId: row.school_id,
            packageId: row.package_id,
            startDate: row.start_date,
            endDate: row.end_date,
            status: row.status,
            autoRenew: Boolean(row.auto_renew),
            paymentStatus: row.payment_status
        }));

        return NextResponse.json(subscriptions);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}

export async function PUT(request: NextRequest) {
    // Basic PUT handler for updating specific subscription if needed, or create [id] route.
    // For now, let's just assume we might need it or rely on [id] route.
    return NextResponse.json({ message: "Use dynamic route" });
}
