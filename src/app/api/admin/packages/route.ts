import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";

export async function GET(request: NextRequest) {
    const session = await getSession();
    // Public or Admin? Packages info might be public in some contexts, but let's restrict or allow.
    // Admin needs to see all.

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows]: [any[], any] = await connection.query(`SELECT * FROM packages ORDER BY price ASC`);

        const packages = rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            duration: row.duration,
            features: typeof row.features === 'string' ? JSON.parse(row.features) : row.features,
            maxUsers: row.max_users,
            type: row.type
        }));

        return NextResponse.json(packages);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
