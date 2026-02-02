import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import pool from "../../../../lib/db";
import crypto from "crypto";
import { z } from "zod";

// GET all modules for the logged-in teacher
export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows]: [any[], any] = await connection.query(
      "SELECT * FROM modules WHERE teacher_id = ? ORDER BY created_at DESC",
      [session.userId]
    );

    const teacherModules = rows.map((row: any) => ({
      id: row.id,
      teacherId: row.teacher_id,
      title: row.title,
      description: row.description,
      type: row.type,
      contentUrl: row.content_url,
      fileName: row.file_name,
      fileType: row.file_type,
      subject: row.subject, // Assuming column exists
      createdAt: row.created_at,
    }));

    return NextResponse.json(teacherModules);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// Define the schema for creating a module
const createModuleSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["video", "pdf", "quiz", "document"]),
  contentUrl: z.string().url("A valid URL for the content is required."),
  fileName: z.string().optional(),
  fileType: z.string().optional(),
  subject: z.string().optional(),
  grade: z.string().optional(),
  duration: z.number().optional(),
  fileSize: z.number().optional(),
});

// POST a new module
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  let connection;
  try {
    const json = await request.json();
    const parseResult = createModuleSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { title, description, type, contentUrl, fileName, fileType, subject } = parseResult.data;

    const newModuleId = `mod-${crypto.randomBytes(4).toString("hex")}`;
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' '); // MySQL format

    connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO modules (id, teacher_id, title, description, type, content_url, subject, file_name, file_type, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newModuleId, session.userId, title, description, type, contentUrl, subject || null, fileName || null, fileType || null, createdAt]
    );

    const newModule = {
      id: newModuleId,
      teacherId: session.userId,
      title,
      description,
      type,
      contentUrl,
      fileName,
      fileType,
      subject,
      createdAt: createdAt,
    };

    return NextResponse.json(
      { success: true, message: "Module created", module: newModule },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating module:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
