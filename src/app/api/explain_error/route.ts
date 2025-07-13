import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { errorText } = await req.json();

  if (!errorText || typeof errorText !== "string") {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const prompt = `
You are an expert programming assistant.

Analyze the following input. It could be:
- A raw error message (from a terminal, stack trace, etc.)
- A snippet of source code (from a file)

Your job is:

1. If it's an **error message**, explain it clearly to a beginner:
   - What the error means in general
   - What the specific message says
   - Likely causes
   - How to fix it (with examples)

2. If it's **valid code with no error**, reply:
   "✅ No error found in this code."
   Then provide 1–3 beginner-friendly tips to improve or optimize the code.

Only respond with what is needed. Be concise but helpful.

---

Input:
${errorText.trim()}
`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const explanation = chat.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("[OpenAI Error]", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
