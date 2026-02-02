import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/session";
import pool from "../../../../../lib/db";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: moduleId } = await context.params;

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows]: [any[], any] = await connection.query("SELECT * FROM modules WHERE id = ?", [moduleId]);
    if (rows.length === 0) return NextResponse.json({ success: false, message: "Module not found" }, { status: 404 });

    const module = rows[0];
    // Normalize keys if needed, assuming DB snake_case vs JS camelCase
    const moduleData = {
      id: module.id,
      title: module.title,
      description: module.description,
      type: module.type,
      contentUrl: module.content_url,
      teacherId: module.teacher_id,
      createdAt: module.created_at,
      updatedAt: module.updated_at
    };

    return NextResponse.json(moduleData);
  } catch (e) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: moduleId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    // Check ownership
    const [rows]: [any[], any] = await connection.query("SELECT teacher_id FROM modules WHERE id = ?", [moduleId]);
    if (rows.length === 0) return NextResponse.json({ success: false, message: "Module not found" }, { status: 404 });

    if (rows[0].teacher_id !== session.id) { // Assuming session.id is mapped to user id
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connection.query("DELETE FROM modules WHERE id = ?", [moduleId]);
    return NextResponse.json({ success: true, message: "Module deleted" });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: moduleId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let connection;
  try {
    const body = await request.json();
    connection = await pool.getConnection();

    // Check ownership
    const [rows]: [any[], any] = await connection.query("SELECT teacher_id FROM modules WHERE id = ?", [moduleId]);
    if (rows.length === 0) return NextResponse.json({ success: false, message: "Module not found" }, { status: 404 });

    if (rows[0].teacher_id !== session.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await connection.query("UPDATE modules SET title = ?, description = ?, type = ?, content_url = ? WHERE id = ?",
      [body.title, body.description, body.type, body.contentUrl, moduleId]);

    return NextResponse.json({ success: true, message: "Module updated successfully" });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// POST is redundant here as it is usually on collection route /modules/, but keeping if matched old route pattern
// The old file had POST on [id] which is weird, maybe for create with ID?
// Standard REST: POST /api/modules.
// I'll skip POST on [id] unless strictly needed. Using PUT for update is enough.
