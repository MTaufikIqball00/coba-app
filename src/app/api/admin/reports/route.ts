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

        // Calculate Monthly Revenue (Mocked via Payments table aggregation)
        const [revenueRows]: [any[], any] = await connection.query(`
        SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as revenue 
        FROM payments 
        WHERE status = 'paid' 
        GROUP BY month 
        ORDER BY month DESC 
        LIMIT 12
    `);

        // Calculate Active Schools per Province
        const [provinceRows]: [any[], any] = await connection.query(`
        SELECT province, COUNT(*) as school_count, SUM(user_capacity) as total_users
        FROM schools 
        GROUP BY province
    `);

        const monthlyRevenue = revenueRows.map((r: any) => ({
            month: r.month,
            revenue: Number(r.revenue),
            growth: 0 // meaningful calc requires more data
        }));

        const provinceDistribution = provinceRows.map((r: any) => ({
            province: r.province,
            schoolCount: r.school_count,
            totalUsers: Number(r.total_users),
            activePercentage: 100 // placeholder
        }));

        return NextResponse.json({
            monthlyRevenue,
            provinceDistribution
        });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
