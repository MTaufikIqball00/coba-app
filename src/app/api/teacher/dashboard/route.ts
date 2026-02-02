import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";
import { analyzeStudentRisk } from "../../../../lib/utils/risk-analysis";
import { Student } from "../../../../lib/types/student";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "teacher") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let connection;
    try {
        connection = await pool.getConnection();

        // Use a JOIN to get name from users table
        // Mapped: average_score -> averageScore, attendance_rate -> activityLevel
        // Filter by school_id via users table
        const [studentRows]: [any[], any] = await connection.query(
            `SELECT s.id, u.name, s.user_id as studentId, s.average_score as averageScore, s.attendance_rate as attendanceRate, s.activity_level as activityLevel, 'active' as status, s.class_name as class 
             FROM students s
             JOIN users u ON s.user_id = u.id
             WHERE u.school_id = (SELECT school_id FROM users WHERE id = ?)`,
            [session.id]
        );

        // Map to Student interface required by risk-analysis
        const studentsForAnalysis: Student[] = studentRows.map((s: any) => ({
            id: s.id,
            name: s.name,
            class: s.class,
            status: 'active', // Default
            averageScore: s.averageScore || 0,
            activityLevel: s.activityLevel || 0,

            // Mapped fields
            gpa: (s.averageScore || 0) / 25,
            attendanceRate: s.activityLevel || 0,

            // Default values for required fields not in this specific query
            studentId: s.id, // Using DB ID as studentId
            email: "",
            phone: "",
            semester: 1,
            grade: 10,
            enrollmentDate: new Date().toISOString(),
            major: "General",
            school: { name: "Unknown School", province: "Jawa Barat" },
            totalCredits: 0,
            completedCredits: 0,
            assignmentCompletion: 0,
            quizAverage: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),

            // Optional fields
            riskStatus: 'Aman',
            riskScore: 0
        }));

        const { stats: riskStats, students: analyzedStudents } = analyzeStudentRisk(studentsForAnalysis);

        // Count from analyzed result
        const atRiskCount = analyzedStudents.filter(
            (s) => s.riskStatus === "Berisiko Tinggi" || s.riskStatus === "Berisiko Sedang"
        ).length;

        const stats = {
            activeAssignments: 12,
            assignmentCompletion: "85%",
            totalModules: 24,
            modulesViewed: 156,
            verifiedAttendance: 89,
            pendingAttendance: 5,
            totalQuizzes: 18,
            avgQuizScore: "78%",
            studentsAtRisk: atRiskCount,
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
