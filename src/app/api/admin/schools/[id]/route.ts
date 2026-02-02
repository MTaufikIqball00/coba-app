import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/session";
import pool from "../../../../../lib/db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    const { id } = await params;

    if (!session || !['admin_langganan', 'admin_sekolah'].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const connection = await pool.getConnection();

        await connection.query(
            `UPDATE schools SET name=?, address=?, city=?, province=?, postal_code=?, phone=?, email=?, headmaster=?, subscription_status=?, level=?, academic_year=?, user_capacity=? WHERE id=?`,
            [body.name, body.address, body.city, body.province, body.postalCode, body.phone, body.email, body.headmaster, body.subscriptionStatus, body.level, body.academicYear, body.userCapacity, id]
        );

        connection.release();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update school error:", error);
        return NextResponse.json({ message: "Failed to update school" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    const { id } = await params;

    if (!session || !['admin_langganan'].includes(session.role)) { // Only super admin?
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const connection = await pool.getConnection();
        await connection.query("DELETE FROM schools WHERE id = ?", [id]);
        connection.release();
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete school error:", error);
        return NextResponse.json({ message: "Failed to delete school" }, { status: 500 });
    }
}
