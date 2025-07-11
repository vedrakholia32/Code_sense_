// src/app/api/explain-error/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { errorText } = body;

  if (!errorText || typeof errorText !== "string") {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key is not configured");
    return NextResponse.json({
      explanation:
        "OpenAI API key is not configured. Please add your OPENAI_API_KEY to the .env.local file.",
    });
  }

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert programming assistant that explains code errors in simple, clear language. Be brief, useful, and explain possible causes and solutions.",
        },
        {
          role: "user",
          content: `Explain this error to a beginner:\n\n${errorText}`,
        },
      ],
    });

    const explanation =
      chat.choices[0]?.message?.content || "No explanation found.";
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("[OpenAI Error]", error);
    return NextResponse.json({
      explanation: `Error communicating with OpenAI: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
}
