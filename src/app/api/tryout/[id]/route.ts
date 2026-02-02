import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
// Note: Folder structure is src/app/api/tryout/[id]/route.ts
// So path to lib is ../../../../lib/db
// api -> tryout -> [id] -> route.ts
// .. -> [id]
// ../.. -> tryout
// ../../.. -> api
// ../../../.. -> app -> NO.
// src/app/api/tryout/[id/route.ts
// 1   2   3      4
// ../ = [id]/ (content) ? No.
// Let's count standard ../
// File: src/app/api/tryout/[id]/route.ts
// ../ -> src/app/api/tryout/
// ../../ -> src/app/api/
// ../../../ -> src/app/
// ../../../../ -> src/
// So src/lib/db is ../../../../lib/db. Correct.

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Params is a Promise in Next.js 15+
) {
    const { id } = await params;
    let connection;
    try {
        connection = await pool.getConnection();

        // Fetch Tryout Details
        const [tryoutRows]: [any[], any] = await connection.query(
            "SELECT * FROM tryouts WHERE id = ?",
            [id]
        );

        if (tryoutRows.length === 0) {
            return NextResponse.json({ error: "Tryout not found" }, { status: 404 });
        }

        const tryout = tryoutRows[0];

        // Fetch Questions
        const [questionRows]: [any[], any] = await connection.query(
            "SELECT * FROM tryout_questions WHERE tryout_id = ?",
            [id]
        );

        // Parse options from JSON string if necessary (mysql2 usually handles JSON columns automatically if defined as JSON, 
        // but safe to check type or parse if string).
        // In our migration we defined it as JSON. mysql2 returns it as object usually.
        // However, let's map it to be safe.

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const questions = questionRows.map((q: any) => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }));

        return NextResponse.json({
            ...tryout,
            questions,
        });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        if (connection) connection.release();
    }
}
