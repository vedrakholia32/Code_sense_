import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import openai from "../../../lib/openai";

const SECRET_KEY = process.env.NEXT_PUBLIC_ERRORSENSE_SECRET_KEY;

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-errorsense-secret");
  if (!secret || secret !== SECRET_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { errorText } = await req.json();

  if (!errorText || typeof errorText !== "string") {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const prompt = `
You are an expert programming assistant specialized in error detection and code analysis.

Carefully analyze the following selected text/code. It could be:
- A runtime error message or stack trace
- Source code with syntax errors
- Source code with logical/runtime issues
- Valid code with no errors

Your task:

1. **If ANY error is found** (syntax, runtime, logical, or any other type):
   - Clearly state "❌ ERROR DETECTED"
   - Explain what type of error it is
   - Describe what's wrong in simple terms
   - Provide specific fix suggestions with examples
   - Show corrected code if applicable

2. **If NO errors are found**:
   - Reply: "✅ NO ERROR FOUND"
   - Provide 1-2 brief improvement suggestions (optional)

Be thorough in your analysis. Check for:
- Syntax errors (missing semicolons, brackets, quotes, etc.)
- Runtime errors (undefined variables, type mismatches, etc.)
- Logical errors (infinite loops, wrong conditions, etc.)
- Common programming mistakes

---

Selected Text to Analyze:
${errorText.trim()}
`;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const explanation =
      chat.choices[0]?.message?.content || "No response generated.";
    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("[OpenAI Error]", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
