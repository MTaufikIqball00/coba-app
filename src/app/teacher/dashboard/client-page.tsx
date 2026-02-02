"use client";
import React, { useEffect, useState } from "react";
import TeacherDashboard from "../../components/admin/TeacherDashboard";

export default function TeacherDashboardClientWrapper({ session }: { session: any }) {
    const [stats, setStats] = useState({
        activeAssignments: 0,
        assignmentCompletion: "0%",
        totalModules: 0,
        modulesViewed: 0,
        verifiedAttendance: 0,
        pendingAttendance: 0,
        totalQuizzes: 0,
        avgQuizScore: "0%",
        studentsAtRisk: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/teacher/dashboard');
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

    return <TeacherDashboard session={session} stats={stats} />;
}
