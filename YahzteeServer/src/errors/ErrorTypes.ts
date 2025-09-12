export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_USERNAME = "INVALID_USERNAME",
  INVALID_GAME_CODE = "INVALID_GAME_CODE",

  // Game errors
  GAME_NOT_FOUND = "GAME_NOT_FOUND",
  GAME_ALREADY_STARTED = "GAME_ALREADY_STARTED",
  GAME_FULL = "GAME_FULL",
  GAME_ALREADY_EXISTS = "GAME_ALREADY_EXISTS",

  // Player errors
  PLAYER_NOT_FOUND = "PLAYER_NOT_FOUND",
  PLAYER_NAME_TAKEN = "PLAYER_NAME_TAKEN",
  NOT_YOUR_TURN = "NOT_YOUR_TURN",
  PLAYER_NOT_HOST = "PLAYER_NOT_HOST",

  // Action errors
  INVALID_ACTION = "INVALID_ACTION",
  DICE_ALREADY_ROLLED = "DICE_ALREADY_ROLLED",
  CANNOT_ROLL_DICE = "CANNOT_ROLL_DICE",
  CANNOT_LOCK_DICE = "CANNOT_LOCK_DICE",
  CANNOT_SELECT_SCORE = "CANNOT_SELECT_SCORE",
  CANNOT_SKIP = "CANNOT_SKIP",

  // Connection errors
  NOT_CONNECTED_TO_GAME = "NOT_CONNECTED_TO_GAME",
  SOCKET_NOT_CONNECTED = "SOCKET_NOT_CONNECTED",

  // Internal errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ErrorDetails {
  field?: string;
  value?: any;
  expected?: any;
  [key: string]: any;
}

export class WebSocketError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: ErrorDetails
  ) {
    super(message);
    this.name = "WebSocketError";
  }
}

// Predefined error creators for common scenarios
export const createValidationError = (
  message: string,
  details?: ErrorDetails
): WebSocketError => {
  return new WebSocketError(ErrorCode.VALIDATION_ERROR, message, details);
};

export const createGameNotFoundError = (gameCode: string): WebSocketError => {
  return new WebSocketError(
    ErrorCode.GAME_NOT_FOUND,
    `Game with code ${gameCode} not found`,
    { gameCode }
  );
};

export const createPlayerNotFoundError = (
  playerName: string
): WebSocketError => {
  return new WebSocketError(
    ErrorCode.PLAYER_NOT_FOUND,
    `Player ${playerName} not found`,
    { playerName }
  );
};

export const createNotYourTurnError = (): WebSocketError => {
  return new WebSocketError(ErrorCode.NOT_YOUR_TURN, "It's not your turn");
};

export const createPlayerNotHostError = (): WebSocketError => {
  return new WebSocketError(
    ErrorCode.PLAYER_NOT_HOST,
    "You are not the host of this game"
  );
};

export const createGameAlreadyStartedError = (): WebSocketError => {
  return new WebSocketError(
    ErrorCode.GAME_ALREADY_STARTED,
    "Game has already started"
  );
};

export const createPlayerNameTakenError = (
  playerName: string
): WebSocketError => {
  return new WebSocketError(
    ErrorCode.PLAYER_NAME_TAKEN,
    `Player name "${playerName}" is already taken`,
    { playerName }
  );
};

export const createInvalidActionError = (
  action: string,
  reason: string
): WebSocketError => {
  return new WebSocketError(
    ErrorCode.INVALID_ACTION,
    `Invalid action: ${action}. ${reason}`,
    { action, reason }
  );
};

export const createInternalError = (
  message: string,
  originalError?: Error
): WebSocketError => {
  return new WebSocketError(ErrorCode.INTERNAL_ERROR, message, {
    originalError: originalError?.message,
  });
};
