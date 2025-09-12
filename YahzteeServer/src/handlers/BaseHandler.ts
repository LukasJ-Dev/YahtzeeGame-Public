import { CustomSocket } from "../errors";
import { GameManager, PlayerService, EventService } from "../services";
import { ErrorHandler } from "../errors";

export interface HandlerContext {
  gameManager: GameManager;
  playerService: PlayerService;
  eventService: EventService;
  errorHandler: ErrorHandler;
}

export interface SocketHandler {
  handle(socket: CustomSocket, data?: any): Promise<void> | void;
}

export abstract class BaseHandler implements SocketHandler {
  constructor(protected context: HandlerContext) {}

  abstract handle(socket: CustomSocket, data?: any): Promise<void> | void;

  /**
   * Validate that socket is connected to a game
   */
  protected validateSocketConnection(socket: CustomSocket): string {
    if (!socket.gameCode) {
      throw new Error("Not connected to any game");
    }
    return socket.gameCode;
  }

  /**
   * Validate that socket has a player
   */
  protected validateSocketPlayer(socket: CustomSocket) {
    if (!socket.player) {
      throw new Error("Player not found");
    }
    return socket.player;
  }

  /**
   * Handle errors consistently across all handlers
   */
  protected handleError(socket: CustomSocket, error: Error): void {
    this.context.errorHandler.handleSocketError(socket, error);
  }

  /**
   * Update game activity
   */
  protected updateGameActivity(gameCode: string): void {
    this.context.gameManager.updateActivity(gameCode);
  }
}
