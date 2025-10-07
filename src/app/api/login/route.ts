import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

import { users as dummyUsers } from "../../../lib/dummy-data/users";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // --- Mock Authentication Logic ---
    // In a real app, you would look this up in a database
    const user = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah" },
        { status: 401 }
      );
    }
    // --- End Mock Authentication Logic ---

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      console.error("JWT_SECRET_KEY is not set in environment variables.");
      return NextResponse.json(
        { success: false, message: "Konfigurasi server tidak lengkap." },
        { status: 500 }
      );
    }

    // Create JWT payload
    const payload: { [key: string]: any } = {
      userId: user.id,
      role: user.role,
      name: user.name,
    };

    // Add student-specific fields to payload if they exist
    if (user.role === "student") {
      const studentDetails = user as any; // Cast to access potential student fields
      if (studentDetails.grade) payload.grade = studentDetails.grade;
      if (studentDetails.school) payload.school = studentDetails.school;
    }

    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(secret));

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Return success and the full user object
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: user, // Return the full user object
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
