"use client";

import { useState } from "react";

interface StudentAnalysis {
    nis: number;
    nama_siswa: string;
    rata_rata_nilai: number;
    nilai_trend: number;
    total_absensi: number;
    sakit: number;
    izin: number;
    alpa: number;
    status_risiko: "Aman" | "Berisiko Sedang" | "Berisiko Tinggi";
    risk_score: number;
}

interface AnalysisResult {
    metadata: {
        total_siswa: number;
        berisiko_tinggi: number;
        berisiko_sedang: number;
        aman: number;
    };
    data_siswa: StudentAnalysis[];
}

export default function AnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/api/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Gagal melakukan analisis");
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToDatabase = async () => {
        if (!result) return;
        setLoading(true);
        try {
            const response = await fetch("/api/students/update-risk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: result.data_siswa }),
            });

            if (!response.ok) throw new Error("Gagal menyimpan data");

            alert("Data berhasil disimpan ke database!");
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (status: string) => {
        switch (status) {
            case "Berisiko Tinggi":
                return "bg-red-100 text-red-800 border-red-200";
            case "Berisiko Sedang":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Aman":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Analisis Risiko Siswa (AI)
            </h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Data Nilai & Absensi</h2>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className={`px-6 py-2 rounded-lg font-medium text-white transition-all
              ${!file || loading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                            }`}
                    >
                        {loading ? "Menganalisis..." : "Mulai Analisis"}
                    </button>
                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                        ⚠️ {error}
                    </div>
                )}
            </div>

            {/* Result Section */}
            {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                            <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Siswa</span>
                            <span className="text-4xl font-bold text-gray-800 mt-2">{result.metadata.total_siswa}</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex flex-col items-center justify-center">
                            <span className="text-red-600 text-sm font-medium uppercase tracking-wider">Berisiko Tinggi</span>
                            <span className="text-4xl font-bold text-red-600 mt-2">{result.metadata.berisiko_tinggi}</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500 flex flex-col items-center justify-center">
                            <span className="text-yellow-600 text-sm font-medium uppercase tracking-wider">Berisiko Sedang</span>
                            <span className="text-4xl font-bold text-yellow-600 mt-2">{result.metadata.berisiko_sedang}</span>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 flex flex-col items-center justify-center">
                            <span className="text-green-600 text-sm font-medium uppercase tracking-wider">Aman</span>
                            <span className="text-4xl font-bold text-green-600 mt-2">{result.metadata.aman}</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-semibold text-gray-800">Detail Analisis Siswa</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Nama Siswa</th>
                                        <th className="px-6 py-4 font-semibold text-center">Rata-rata Nilai</th>
                                        <th className="px-6 py-4 font-semibold text-center">Trend Nilai</th>
                                        <th className="px-6 py-4 font-semibold text-center">Total Absensi</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status Risiko</th>
                                        <th className="px-6 py-4 font-semibold text-center">Skor Risiko</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {result.data_siswa.map((siswa, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{siswa.nama_siswa}</div>
                                                <div className="text-xs text-gray-400">NIS: {siswa.nis}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded bg-gray-100 font-medium ${siswa.rata_rata_nilai < 70 ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {siswa.rata_rata_nilai.toFixed(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-medium ${siswa.nilai_trend < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {siswa.nilai_trend < 0 ? '📉 Menurun' : siswa.nilai_trend > 0 ? '📈 Naik' : '➡️ Stabil'}
                                                    <span className="text-xs ml-1 text-gray-400">({siswa.nilai_trend.toFixed(3)})</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded bg-gray-100 font-medium ${siswa.total_absensi > 10 ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {siswa.total_absensi}
                                                </span>
                                                <div className="text-[10px] text-gray-400 mt-1">
                                                    (S:{siswa.sakit} I:{siswa.izin} A:{siswa.alpa})
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskColor(siswa.status_risiko)}`}>
                                                    {siswa.status_risiko}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-gray-500">
                                                {siswa.risk_score.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
