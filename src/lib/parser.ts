export interface ParsedError {
  errorType: string | null;
  filePath: string | null;
  lineNumber: number | null;
}

export function parseErrorStack(errorText: string): ParsedError {
  let errorType: string | null = null;
  let filePath: string | null = null;
  let lineNumber: number | null = null;

  // Extract error type from first line (e.g., "TypeError: ...")
  const errorTypeMatch = errorText.match(/^(\w+Error)/);
  if (errorTypeMatch) {
    errorType = errorTypeMatch[1];
  }

  // Extract file path and line number from stack trace line like:
  // at src/pages/api/user.ts:27:13
  // or at pages/api/user.ts:27:13
  const fileLineMatch = errorText.match(/at\s+([\w\/\.-]+):(\d+):\d+/);
  if (fileLineMatch) {
    filePath = fileLineMatch[1];
    lineNumber = parseInt(fileLineMatch[2], 10);
  }

  return { errorType, filePath, lineNumber };
}
