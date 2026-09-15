type PushLogLevel = "info" | "warn" | "error";

const PREFIX = "[push]";

function formatError(error: unknown) {
  if (error == null) {
    return { message: "unknown_null_error" };
  }
  if (error instanceof Error) {
    return { name: error.name, message: error.message || "empty_error_message" };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  try {
    return { message: JSON.stringify(error) };
  } catch {
    return { message: String(error) };
  }
}

/**
 * Structured push diagnostics. Filter Metro logs with `[push]`.
 */
export function pushLog(
  level: PushLogLevel,
  step: string,
  details?: Record<string, unknown>,
) {
  const payload = {
    step,
    ...(details ?? {}),
  };

  let serialized = "";
  try {
    serialized = JSON.stringify(payload);
  } catch {
    serialized = '{"step":"' + step + '","serializeError":true}';
  }

  const message = `${PREFIX} ${step} ${serialized}`;

  if (level === "error") {
    console.warn(message); // use warn so LogBox doesn't render a red "null" crash card
  } else if (level === "warn") {
    console.warn(message);
  } else {
    console.log(message);
  }
}

export function pushLogError(
  step: string,
  error: unknown,
  details?: Record<string, unknown>,
) {
  const formatted = formatError(error);
  pushLog("error", step, {
    ...details,
    errorMessage: formatted.message,
    errorName: formatted.name,
  });
}

export function maskToken(token: string | null | undefined) {
  if (!token) return null;
  if (token.length <= 12) return `${token.slice(0, 4)}…`;
  return `${token.slice(0, 8)}…${token.slice(-4)} (len=${token.length})`;
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
