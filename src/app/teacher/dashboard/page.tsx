import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import TeacherDashboard from "../../components/admin/TeacherDashboard";

export default async function TeacherDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  // Fetch stats from API (server-side call or client-side)
  // Since this is a server component, we can call the DB directly if we wanted, 
  // but to keep consistency let's use the API pattern or direct DB call here.
  // For simplicity reusing the logic via fetch might need absolute URL, so better to just use client component pattern 
  // OR just direct DB call here. 

  // Let's make it a Client Component wrapper or just fetch here if we can. 
  // Actually, let's keep it clean. We'll pass initial data?
  // TeacherDashboard component seems to accept props. 
  // Using direct fetch to localhost API in Server Component can be tricky with auth headers.
  // Let's use the DB mainly. BUT, I just created an API route. 
  // Let's modify TeacherDashboard component to fetch data? 
  // Or just mock the stats here correctly using DB calls?
  // User asked to migrate to "Database Driven".

  // Let's assume for now we pass static/mocked structure but sourced from DB logic if possible.
  // Or better: Use the API I just created? No, calling own API in App Router requires full URL.

  // I will make this page a client component wrapper or fetch data inside the component.
  // The current file exports a default async function.

  // Let's use a client-side data fetching approach for consistency with other dashboards I migrated.

  return <TeacherDashboardClientWrapper session={session} />;
}

import TeacherDashboardClientWrapper from "./client-page";