import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

import { users as dummyUsers } from "../../../lib/dummy-data/users";
import { schools as dummySchools } from "../../../lib/dummy-data/schools";
import { dummyStudents } from "../../../lib/dummy-data/students";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    const user = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Find school and student details
    const school = user.schoolId
      ? dummySchools.find((s) => s.id === user.schoolId)
      : null;
    let grade: number | null = null;

    if (user.role === "student") {
      const studentData = dummyStudents.find((s) => s.name === user.name);
      if (studentData && studentData.class) {
        grade = parseInt(studentData.class.split("-")[0], 10);
      }
    }

    // Create a comprehensive user object to return
    const userProfile = {
      ...user,
      school: school, // Embed the full school object
      grade: grade,
    };

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      console.error("JWT_SECRET_KEY is not set in environment variables.");
      return NextResponse.json(
        { success: false, message: "Konfigurasi server tidak lengkap." },
        { status: 500 }
      );
    }

    const payload: { [key: string]: any } = {
      userId: user.id,
      role: user.role,
      name: user.name,
      school: school,
      grade: grade, // Add grade to JWT payload
    };

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userProfile, // Return the enriched user object
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
