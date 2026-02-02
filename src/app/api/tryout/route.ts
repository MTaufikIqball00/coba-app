
import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
    let connection;
    try {
        connection = await pool.getConnection(); // Get a connection from the pool
        const [rows] = await connection.query("SELECT * FROM tryouts ORDER BY created_at DESC");
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release(); // Release connection back to pool
    }
}
