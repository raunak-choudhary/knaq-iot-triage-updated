interface ApiErrorData {
  detail?: string | Array<{ msg?: string; message?: string }>;
  message?: string;
}

interface RtkError {
  status?: number | string;
  data?: ApiErrorData;
  error?: string;
}

export function extractApiError(error: unknown): string {
  if (!error) return "An unknown error occurred.";

  const rtkError = error as RtkError;

  if (rtkError.status === 409) {
    const data = rtkError.data;
    if (typeof data?.detail === "string") return data.detail;
    return "Conflict: this action cannot be performed in the current state.";
  }

  if (rtkError.status === 422) {
    const data = rtkError.data;
    if (Array.isArray(data?.detail) && data.detail.length > 0) {
      const first = data.detail[0];
      return first?.msg ?? first?.message ?? "Validation error.";
    }
    if (typeof data?.detail === "string") return data.detail;
    return "Validation error.";
  }

  if (
    rtkError.status === "FETCH_ERROR" ||
    typeof rtkError.error === "string"
  ) {
    return "Network error: unable to connect to the server.";
  }

  const data = rtkError.data;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  return "An unexpected error occurred. Please try again.";
}
