import { NextRequest, NextResponse } from "next/server";
import { dummyStudents } from "../../../../../lib/dummy-data";
import { getSession } from "../../../../../lib/auth/session";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const student = dummyStudents.get(id);
  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }
  return NextResponse.json({
    success: true,
    student,
  });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const student = dummyStudents.get(id);
  if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }
  try {
    const updateData = await request.json();
    const updatedStudent = {
      ...student,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    dummyStudents.set(id, updatedStudent);
    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }
}
