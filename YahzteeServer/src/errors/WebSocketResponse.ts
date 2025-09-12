import { ErrorCode, ErrorDetails, WebSocketError } from "./ErrorTypes";

export interface WebSocketErrorResponse {
  code: ErrorCode;
  message: string;
  details?: ErrorDetails;
}

export interface WebSocketResponse<T = any> {
  success: boolean;
  data?: T;
  error?: WebSocketErrorResponse;
  requestId?: string;
  timestamp?: number;
}

export class ResponseBuilder {
  static success<T>(data: T, requestId?: string): WebSocketResponse<T> {
    return {
      success: true,
      data,
      requestId,
      timestamp: Date.now(),
    };
  }

  static error(
    code: ErrorCode,
    message: string,
    details?: ErrorDetails,
    requestId?: string
  ): WebSocketResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
      },
      requestId,
      timestamp: Date.now(),
    };
  }

  static fromError(error: Error, requestId?: string): WebSocketResponse {
    if (error instanceof WebSocketError) {
      return this.error(error.code, error.message, error.details, requestId);
    }

    return this.error(
      ErrorCode.UNKNOWN_ERROR,
      error.message || "An unknown error occurred",
      undefined,
      requestId
    );
  }
}
