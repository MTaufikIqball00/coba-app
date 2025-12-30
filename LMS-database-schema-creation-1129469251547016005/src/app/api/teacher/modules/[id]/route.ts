import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/session";
import { dummyModules } from "../../../../../lib/dummy-data";

// ✅ FIXED: Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// Example GET handler for a single module
// ✅ FIXED: Updated parameter structure and added await for params
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  // ✅ FIXED: Await the params Promise
  const { id: moduleId } = await context.params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const module = dummyModules.get(moduleId);

  if (!module) {
    return NextResponse.json(
      { success: false, message: "Module not found" },
      { status: 404 }
    );
  }

  // Optional: Check if the user has permission to view this module
  if (session.role !== "teacher" || module.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json(module);
}

// ✅ FIXED: Updated parameter structure and added await for params
export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  // ✅ FIXED: Await the params Promise
  const { id: moduleId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const moduleToDelete = dummyModules.get(moduleId);

  if (!moduleToDelete) {
    return NextResponse.json(
      { success: false, message: "Module not found" },
      { status: 404 }
    );
  }

  // Security check: ensure the teacher owns the module they are trying to delete
  if (moduleToDelete.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const deleted = dummyModules.delete(moduleId);

  if (deleted) {
    return NextResponse.json({ success: true, message: "Module deleted" });
  } else {
    // This case should theoretically not be reached if the get() succeeded
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ ADDED: If you need other HTTP methods, add them with the same pattern
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: moduleId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const moduleToUpdate = dummyModules.get(moduleId);

  if (!moduleToUpdate) {
    return NextResponse.json(
      { success: false, message: "Module not found" },
      { status: 404 }
    );
  }

  // Security check: ensure the teacher owns the module they are trying to update
  if (moduleToUpdate.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Update the module with new data
  const updatedModule = {
    ...moduleToUpdate,
    ...body,
    id: moduleId, // Ensure ID doesn't change
    teacherId: session.userId, // Ensure teacherId doesn't change
    updatedAt: new Date().toISOString(),
  };

  dummyModules.set(moduleId, updatedModule);

  return NextResponse.json({
    success: true,
    message: "Module updated successfully",
    module: updatedModule,
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: moduleId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  // Create new module with the specified ID
  const newModule = {
    id: moduleId,
    teacherId: session.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  };

  dummyModules.set(moduleId, newModule);

  return NextResponse.json(
    {
      success: true,
      message: "Module created successfully",
      module: newModule,
    },
    { status: 201 }
  );
}
