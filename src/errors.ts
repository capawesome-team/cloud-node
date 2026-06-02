/**
 * Error thrown when the Capawesome Cloud API responds with a non-2xx status code.
 */
export class CapawesomeCloudError extends Error {
  /**
   * The HTTP status code of the response.
   */
  public readonly status: number;
  /**
   * The HTTP status text of the response.
   */
  public readonly statusText: string;
  /**
   * The parsed response body, if any. Usually `{ message: string }`.
   */
  public readonly body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    super(extractMessage(body) ?? `Capawesome Cloud API error: ${status} ${statusText}`);
    this.name = 'CapawesomeCloudError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

function extractMessage(body: unknown): string | undefined {
  if (typeof body === 'string') {
    return body || undefined;
  }
  if (!body || typeof body !== 'object') {
    return undefined;
  }
  const record = body as Record<string, unknown>;
  // `{ message: string }`
  const direct = messageOf(record);
  if (direct) {
    return direct;
  }
  const error = record.error;
  // `{ error: [{ message: string }] }`
  if (Array.isArray(error)) {
    return messageOf(error[0]);
  }
  // `{ error: { issues: [{ message: string }] } }` (validation errors)
  if (error && typeof error === 'object') {
    const issues = (error as Record<string, unknown>).issues;
    if (Array.isArray(issues)) {
      return messageOf(issues[0]);
    }
  }
  return undefined;
}

function messageOf(value: unknown): string | undefined {
  if (value && typeof value === 'object') {
    const message = (value as Record<string, unknown>).message;
    if (typeof message === 'string') {
      return message;
    }
  }
  return undefined;
}
