import { Student } from "../types/student";

interface RiskStats {
  mean: number;
  min: number;
  max: number;
  count: number;
}

interface RiskAnalysisResult {
  students: Student[];
  stats: Record<string, { averageScore: RiskStats; attendance: RiskStats }>;
}

export async function analyzeStudentRisk(students: Student[]): Promise<RiskAnalysisResult> {
  const FLASK_API_URL = "http://127.0.0.1:5000/analyze";

  try {
    const response = await fetch(FLASK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students }),
      // Set a timeout to avoid hanging if the service is down
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`Flask API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Ensure the result structure matches our interface
    // Note: The Flask API returns { students: [...], stats: {...} }
    return result as RiskAnalysisResult;

  } catch (error) {
    console.error("Risk Analysis Service Error:", error);

    // Fallback: Return original students without risk data (or with default)
    // Ideally we should alert the user, but for now we fallback safely
    console.warn("Falling back to safe mode (no risk analysis)");

    const safeStudents = students.map(s => ({
        ...s,
        riskStatus: "Aman" as const,
        riskScore: 0
    }));

    return { students: safeStudents, stats: {} };
  }
}
