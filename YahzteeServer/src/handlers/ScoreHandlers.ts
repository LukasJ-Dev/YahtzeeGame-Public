import { BaseHandler, HandlerContext } from "./BaseHandler";
import { CustomSocket } from "../errors";
import { createNotYourTurnError, createInvalidActionError } from "../errors";

export class SelectScoreHandler extends BaseHandler {
  async handle(socket: CustomSocket, rowIndex: number): Promise<void> {
    try {
      const gameCode = this.validateSocketConnection(socket);
      const game = this.context.gameManager.getGame(gameCode);

      // Update player reference
      socket.player =
        game.getPlayerByName(socket.player?.name || "") || socket.player;

      if (game.getPlayerTurn() !== socket.player?.id) {
        throw createNotYourTurnError();
      }

      if (rowIndex < 0 || rowIndex >= 13) {
        throw createInvalidActionError(
          "select-score",
          "Invalid score row index"
        );
      }

      const newScore = game.selectScore(rowIndex);
      if (!newScore || newScore.length === 0) {
        throw createInvalidActionError(
          "select-score",
          "Cannot select this score"
        );
      }

      // Update activity in GameManager
      this.updateGameActivity(gameCode);

      // Broadcast score selected to room
      this.context.eventService.broadcastScoreSelected(gameCode, newScore);
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }
}

export class SkipTurnHandler extends BaseHandler {
  async handle(socket: CustomSocket): Promise<void> {
    try {
      const gameCode = this.validateSocketConnection(socket);
      const game = this.context.gameManager.getGame(gameCode);

      // Update player reference
      socket.player =
        game.getPlayerByName(socket.player?.name || "") || socket.player;

      if (game.getPlayerTurn() !== socket.player?.id) {
        throw createNotYourTurnError();
      }

      const skip = game.skip();

      if (!skip) {
        throw createInvalidActionError("skip", "Cannot skip at this time");
      }

      // Update activity in GameManager
      this.updateGameActivity(gameCode);

      // Broadcast player skipped to room
      this.context.eventService.broadcastPlayerSkipped(
        gameCode,
        socket.player.id!
      );
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }
}
