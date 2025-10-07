import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { quizzes, Quiz, Question, AnswerChoice } from "./store";
import { z } from "zod";
import crypto from "crypto";

// ✅ Fixed validation schema to match Quiz interface exactly
const answerChoiceSchema = z.object({
  id: z.string().optional(), // Optional for creation, will be generated
  text: z.string().min(1, "Choice text is required"),
});

const questionSchema = z.object({
  id: z.string().optional(), // Optional for creation, will be generated
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum(["multiple_choice", "essay"]),
  points: z.number().min(1).optional().default(10),
  choices: z.array(answerChoiceSchema).optional(),
  correctAnswer: z.string().optional(), // For multiple_choice, this is the text of correct choice
  // Essay specific fields from frontend
  sampleAnswer: z.string().optional(),
  maxScore: z.number().min(1).max(100).optional(),
  weight: z.number().min(1).max(100).optional(),
  rubric: z.string().optional(),
});

const createQuizSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters long")
      .max(200),
    description: z.string().max(1000).default(""), // ✅ Fixed: provide default empty string
    subject: z.string().min(1, "Subject is required").max(100),
    duration: z.number().min(5).max(300).default(60), // 5 min to 5 hours
    maxAttempts: z.number().min(1).max(10).optional().default(1),
    showResults: z.boolean().optional().default(true),
    randomizeQuestions: z.boolean().optional().default(false),
    passingScore: z.number().min(0).max(100).optional().default(70),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    instructions: z.string().max(2000).optional(),
    allowReview: z.boolean().optional().default(true),
    shuffleAnswers: z.boolean().optional().default(false),
    questions: z
      .array(questionSchema)
      .min(1, "At least one question is required"),
  })
  .refine(
    (data) => {
      // Validate that multiple choice questions have choices and correct answer
      return data.questions.every((q) => {
        if (q.questionType === "multiple_choice") {
          return q.choices && q.choices.length >= 2 && q.correctAnswer;
        }
        return true;
      });
    },
    {
      message:
        "Multiple choice questions must have at least 2 choices and a correct answer",
      path: ["questions"],
    }
  );

// GET all quizzes for the logged-in teacher
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const allQuizzes = Array.from(quizzes.values());
    const teacherQuizzes = allQuizzes.filter(
      (quiz) => quiz.teacherId === session.userId
    );

    teacherQuizzes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(teacherQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST a new quiz
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // ✅ Validate input using Zod schema
    const parseResult = createQuizSchema.safeParse(body);

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

    const validatedData = parseResult.data;

    // ✅ Process questions with proper typing
    const processedQuestions: Question[] = validatedData.questions.map(
      (q): Question => {
        const questionId = `q-${crypto.randomBytes(4).toString("hex")}`;
        let choices: AnswerChoice[] | undefined = undefined;
        let correctAnswerId: string | undefined = undefined;

        if (
          q.questionType === "multiple_choice" &&
          q.choices &&
          q.correctAnswer
        ) {
          // Create choices with unique IDs
          choices = q.choices.map(
            (c): AnswerChoice => ({
              id: c.id || `c-${crypto.randomBytes(4).toString("hex")}`,
              text: c.text,
            })
          );

          // Find the correct answer ID by matching text
          correctAnswerId = choices.find((c) => c.text === q.correctAnswer)?.id;

          return {
            id: questionId,
            questionText: q.questionText,
            questionType: q.questionType,
            choices: choices,
            correctAnswer: correctAnswerId,
            points: q.points,
          };
        } else if (q.questionType === "essay") {
            return {
                id: questionId,
                questionText: q.questionText,
                questionType: q.questionType,
                points: q.points,
                sampleAnswer: q.sampleAnswer,
                maxScore: q.maxScore,
                weight: q.weight,
                rubric: q.rubric,
            };
        }

        // Fallback for unexpected types, though Zod should prevent this
        return {
          id: questionId,
          questionText: q.questionText,
          questionType: q.questionType,
          points: q.points,
        };
      }
    );

    // ✅ Calculate total points
    const totalPoints = processedQuestions.reduce(
      (sum, q) => sum + (q.points || 10),
      0
    );

    // ✅ Create new quiz with proper typing
    const newQuiz: Quiz = {
      id: `quiz-${crypto.randomBytes(4).toString("hex")}`,
      teacherId: session.userId,
      title: validatedData.title,
      description: validatedData.description, // Now guaranteed to be string
      subject: validatedData.subject,
      questions: processedQuestions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Required properties
      participants: 0,
      isActive: true,
      averageScore: 0,
      duration: validatedData.duration,
      // Optional properties
      maxAttempts: validatedData.maxAttempts,
      showResults: validatedData.showResults,
      randomizeQuestions: validatedData.randomizeQuestions,
      passingScore: validatedData.passingScore,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      instructions: validatedData.instructions,
      totalPoints,
      allowReview: validatedData.allowReview,
      shuffleAnswers: validatedData.shuffleAnswers,
    };

    quizzes.set(newQuiz.id, newQuiz);

    console.log(
      `✅ Quiz created successfully: ${newQuiz.id} by teacher ${session.userId}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Quiz created successfully",
        quiz: newQuiz,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
            code: issue.code,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON format" },
        { status: 400 }
      );
    }

    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ Fixed PUT update method
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { quizId, ...updateData } = body;

    if (!quizId) {
      return NextResponse.json(
        { success: false, message: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const existingQuiz = quizzes.get(quizId);

    if (!existingQuiz) {
      return NextResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      );
    }

    if (existingQuiz.teacherId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You can only update your own quizzes",
        },
        { status: 403 }
      );
    }

    // ✅ Handle partial updates properly
    const updateSchema = createQuizSchema.partial();
    const parseResult = updateSchema.safeParse(updateData);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid update data.",
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedUpdates = parseResult.data;

    // ✅ Process questions if provided
    let processedQuestions: Question[] | undefined = undefined;
    if (validatedUpdates.questions) {
      processedQuestions = validatedUpdates.questions.map((q): Question => {
        const questionId = q.id || `q-${crypto.randomBytes(4).toString("hex")}`;
        let choices: AnswerChoice[] | undefined = undefined;
        let correctAnswerId: string | undefined = undefined;

        if (
          q.questionType === "multiple_choice" &&
          q.choices &&
          q.correctAnswer
        ) {
          choices = q.choices.map(
            (c): AnswerChoice => ({
              id: c.id || `c-${crypto.randomBytes(4).toString("hex")}`,
              text: c.text,
            })
          );
          correctAnswerId = choices.find((c) => c.text === q.correctAnswer)?.id;
        }

        return {
          id: questionId,
          questionText: q.questionText,
          questionType: q.questionType,
          choices: choices,
          correctAnswer: correctAnswerId,
          points: q.points,
        };
      });
    }

    // ✅ Create properly typed update object
    const updatedQuiz: Quiz = {
      ...existingQuiz,
      ...validatedUpdates,
      questions: processedQuestions || existingQuiz.questions, // Use processed questions or keep existing
      updatedAt: new Date().toISOString(),
      totalPoints: processedQuestions
        ? processedQuestions.reduce((sum, q) => sum + (q.points || 10), 0)
        : existingQuiz.totalPoints,
    };

    quizzes.set(quizId, updatedQuiz);

    return NextResponse.json({
      success: true,
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH toggle quiz active status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== "teacher") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("id");
    const action = searchParams.get("action");

    if (!quizId) {
      return NextResponse.json(
        { success: false, message: "Quiz ID is required" },
        { status: 400 }
      );
    }

    const existingQuiz = quizzes.get(quizId);

    if (!existingQuiz) {
      return NextResponse.json(
        { success: false, message: "Quiz not found" },
        { status: 404 }
      );
    }

    if (existingQuiz.teacherId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: You can only modify your own quizzes",
        },
        { status: 403 }
      );
    }

    let updatedQuiz: Quiz;

    if (action === "toggle-active") {
      updatedQuiz = {
        ...existingQuiz,
        isActive: !existingQuiz.isActive,
        updatedAt: new Date().toISOString(),
      };
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    quizzes.set(quizId, updatedQuiz);

    return NextResponse.json({
      success: true,
      message: `Quiz ${
        updatedQuiz.isActive ? "activated" : "deactivated"
      } successfully`,
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Error updating quiz status:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
