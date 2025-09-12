import { Socket } from "socket.io";
import { WebSocketError, ErrorCode } from "./ErrorTypes";
import { WebSocketResponse, ResponseBuilder } from "./WebSocketResponse";

export interface CustomSocket extends Socket {
  game?: any;
  player?: any;
  gameCode?: string;
}

export class ErrorHandler {
  private logger: any; // You can replace this with a proper logger later

  constructor() {
    // Initialize logger here if needed
  }

  /**
   * Handle and emit error to a specific socket
   */
  public handleSocketError(
    socket: CustomSocket,
    error: Error | WebSocketError,
    requestId?: string
  ): void {
    const response = this.createErrorResponse(error, requestId);

    // Log the error
    this.logError(error, socket);

    // Emit error to socket
    socket.emit("error", response);
  }

  /**
   * Handle and emit error to a room
   */
  public handleRoomError(
    io: any,
    roomId: string,
    error: Error | WebSocketError,
    requestId?: string
  ): void {
    const response = this.createErrorResponse(error, requestId);

    // Log the error
    this.logError(error, { roomId });

    // Emit error to room
    io.to(roomId).emit("error", response);
  }

  /**
   * Create a standardized error response
   */
  public createErrorResponse(
    error: Error | WebSocketError,
    requestId?: string
  ): WebSocketResponse {
    if (error instanceof WebSocketError) {
      return ResponseBuilder.error(
        error.code,
        error.message,
        error.details,
        requestId
      );
    }

    // Handle different types of errors
    if (error.name === "ValidationError") {
      return ResponseBuilder.error(
        ErrorCode.VALIDATION_ERROR,
        error.message,
        undefined,
        requestId
      );
    }

    if (error.name === "TypeError" || error.name === "ReferenceError") {
      return ResponseBuilder.error(
        ErrorCode.INTERNAL_ERROR,
        "An internal error occurred",
        { originalError: error.message },
        requestId
      );
    }

    // Default to unknown error
    return ResponseBuilder.error(
      ErrorCode.UNKNOWN_ERROR,
      error.message || "An unknown error occurred",
      undefined,
      requestId
    );
  }

  /**
   * Validate input and throw appropriate errors
   */
  public validateInput(data: any, rules: ValidationRule[]): void {
    for (const rule of rules) {
      if (!rule.validate(data)) {
        throw new WebSocketError(ErrorCode.VALIDATION_ERROR, rule.message, {
          field: rule.field,
          value: data[rule.field],
        });
      }
    }
  }

  /**
   * Log error for debugging
   */
  private logError(error: Error | WebSocketError, context: any): void {
    const errorInfo: any = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    if (error instanceof WebSocketError) {
      errorInfo.code = error.code;
      errorInfo.details = error.details;
    }

    console.error("WebSocket Error:", JSON.stringify(errorInfo, null, 2));
  }

  /**
   * Handle async errors in socket handlers
   */
  public async handleAsyncError<T>(
    socket: CustomSocket,
    operation: () => Promise<T>,
    requestId?: string
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.handleSocketError(socket, error as Error, requestId);
      return null;
    }
  }
}

// Validation rule interface
export interface ValidationRule {
  field: string;
  validate: (data: any) => boolean;
  message: string;
}

// Common validation rules
export const ValidationRules = {
  required: (field: string): ValidationRule => ({
    field,
    validate: (data) =>
      data &&
      data[field] !== undefined &&
      data[field] !== null &&
      data[field] !== "",
    message: `${field} is required`,
  }),

  minLength: (field: string, minLength: number): ValidationRule => ({
    field,
    validate: (data) => !data[field] || data[field].length >= minLength,
    message: `${field} must be at least ${minLength} characters long`,
  }),

  maxLength: (field: string, maxLength: number): ValidationRule => ({
    field,
    validate: (data) => !data[field] || data[field].length <= maxLength,
    message: `${field} must be no more than ${maxLength} characters long`,
  }),

  pattern: (field: string, pattern: RegExp): ValidationRule => ({
    field,
    validate: (data) => !data[field] || pattern.test(data[field]),
    message: `${field} format is invalid`,
  }),

  gameCode: (): ValidationRule => ({
    field: "gameCode",
    validate: (data) => !data.gameCode || /^[A-Z]{6}$/.test(data.gameCode),
    message: "Game code must be 6 uppercase letters",
  }),
};
