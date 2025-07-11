import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import openai from "@/lib/openai";
import { parseErrorStack } from "@/lib/parser";

export async function POST(req: NextRequest) {
  const { errorText } = await req.json();

  if (!errorText || typeof errorText !== "string") {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const { errorType, filePath, lineNumber } = parseErrorStack(errorText);

  // Extract stack trace lines excluding the first error line
  const stackLines = errorText
    .split("\n")
    .slice(1)
    .map((line) => line.trim())
    .join("\n");

  // Build detailed prompt
  let prompt = `You are a programming assistant. Explain the error below to a beginner, including:\n
- What the error means generally
- What this specific error message says
- Likely causes
- How to fix it with examples\n\n`;

  prompt += "Error Message:\n";
  prompt += `${errorType ?? "Error"}: ${errorText.split("\n")[0]}\n`;

  if (filePath) prompt += `File: ${filePath}\n`;
  if (lineNumber) prompt += `Line: ${lineNumber}\n`;

  if (stackLines) prompt += `Stack trace:\n${stackLines}\n`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const explanation =
      chat.choices[0]?.message?.content || "No explanation found.";
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("[OpenAI Error]", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
