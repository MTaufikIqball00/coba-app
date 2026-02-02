import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || !['admin_langganan'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.query(`
        SELECT p.*, s.name as school_name 
        FROM payments p 
        LEFT JOIN schools s ON p.school_id = s.id 
        ORDER BY p.date DESC
    `);

        const payments = rows.map((row: any) => ({
            id: row.id,
            schoolId: row.school_id,
            schoolName: row.school_name,
            amount: Number(row.amount),
            date: row.date,
            status: row.status,
            method: row.method,
            invoiceUrl: row.invoice_url
        }));

        return NextResponse.json(payments);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
