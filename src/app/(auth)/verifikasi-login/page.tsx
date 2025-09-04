"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function VerifikasiLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nohp, setNohp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = email.trim() !== "" && nohp.trim() !== "";

  // Hardcoded data for read-only fields
  const namaSekolah = "SMAN 1 Contoh";
  const nisn = "1234567890";

  // Effect to check for auth token and verification status
  useEffect(() => {
    const authToken = document.cookie.includes("auth_token");
    if (!authToken) {
      router.push("/login");
      return;
    }

    // Check if user is already verified
    const isVerified = localStorage.getItem("isVerified");
    if (isVerified === "true") {
      router.push("/dashboard");
      return;
    }
  }, [router]);

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isFormValid) {
      setError("Email dan No. HP tidak boleh kosong.");
      setLoading(false);
      return;
    }

    // Simulate verification process with timeout
    setTimeout(() => {
      try {
        // Simple validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,13}$/;

        if (!emailRegex.test(email.trim())) {
          setError("Format email tidak valid.");
          setLoading(false);
          return;
        }

        if (!phoneRegex.test(nohp.trim())) {
          setError("Nomor HP harus 10-13 digit angka.");
          setLoading(false);
          return;
        }

        // Store verification data in localStorage
        localStorage.setItem("isVerified", "true");
        localStorage.setItem("userEmail", email.trim());
        localStorage.setItem("userPhone", nohp.trim());
        localStorage.setItem("verificationDate", new Date().toISOString());

        // Redirect to dashboard after successful verification
        router.push("/dashboard");
      } catch (error) {
        console.error("Verification error:", error);
        setError("Terjadi kesalahan. Silakan coba lagi.");
        setLoading(false);
      }
    }, 1500); // Simulate network delay
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Section: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 bg-blue-700 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 800 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 100 Q150 200 300 100 T800 100"
              stroke="white"
              strokeWidth="45"
              fill="none"
              opacity="0.1"
            />
            <path
              d="M0 700 Q200 650 400 700 T800 700"
              stroke="white"
              strokeWidth="25"
              fill="none"
              opacity="0.1"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2">
            Verifikasi Akun Anda
          </h2>
          <p className="text-white text-opacity-80 mb-8">
            Lengkapi data berikut untuk melanjutkan ke dashboard.
          </p>

          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label className="text-white text-sm font-bold mb-2 block">
                Nama Sekolah
              </label>
              <input
                type="text"
                value={namaSekolah}
                readOnly
                className="w-full px-4 py-3 rounded bg-blue-800 text-white opacity-75 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="text-white text-sm font-bold mb-2 block">
                NISN
              </label>
              <input
                type="text"
                value={nisn}
                readOnly
                className="w-full px-4 py-3 rounded bg-blue-800 text-white opacity-75 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="text-white text-sm font-bold mb-2 block">
                Email *
              </label>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="text-white text-sm font-bold mb-2 block">
                No. HP *
              </label>
              <input
                type="tel"
                placeholder="Masukkan nomor HP Anda"
                value={nohp}
                onChange={(e) => setNohp(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-50"
                required
              />
            </div>

            {error && (
              <p className="text-red-300 text-sm text-center bg-red-900 bg-opacity-50 p-2 rounded-md">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-3 mt-4 bg-white text-blue-700 font-semibold rounded hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memverifikasi..." : "Verifikasi & Lanjutkan"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white relative">
        <div className="w-3/4 h-3/4">
          <Image
            src="/assets/ilustrasiUpdate.png"
            alt="Verifikasi Ilustrasi"
            width={600}
            height={600}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
