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
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }
  return undefined;
}
