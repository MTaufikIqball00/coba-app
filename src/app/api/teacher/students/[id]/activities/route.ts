import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import { dummyActivities } from "../../../../../../lib/dummy-data";

interface RouteContext {
  params: Promise<{ id: string }>; // params sekarang adalah Promise
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const activities = dummyActivities.get(id) || [];

  // Simulate some statistics
  const totalActivities = activities.length;
  const lastActivity = activities.length > 0 ? activities[0].timestamp : null;

  const statistics = {
    totalActivities,
    lastActivity,
  };

  return NextResponse.json({
    success: true,
    activities,
    statistics,
  });
}
