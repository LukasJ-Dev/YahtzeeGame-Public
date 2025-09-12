import { BaseHandler, HandlerContext } from "./BaseHandler";
import { CustomSocket } from "../errors";
import { createNotYourTurnError, createInvalidActionError } from "../errors";

export class RollDiceHandler extends BaseHandler {
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

      const newDice = game?.rollDice();

      if (!newDice || newDice.length === 0) {
        throw createInvalidActionError(
          "roll-dice",
          "Cannot roll dice at this time"
        );
      }

      // Update activity in GameManager
      this.updateGameActivity(gameCode);

      // Broadcast dice rolled to room
      this.context.eventService.broadcastDiceRolled(gameCode, newDice);
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }
}

export class LockDiceHandler extends BaseHandler {
  async handle(socket: CustomSocket, index: number): Promise<void> {
    try {
      const gameCode = this.validateSocketConnection(socket);
      const game = this.context.gameManager.getGame(gameCode);

      // Update player reference
      socket.player =
        game.getPlayerByName(socket.player?.name || "") || socket.player;

      if (game.getPlayerTurn() !== socket.player?.id) {
        throw createNotYourTurnError();
      }

      if (index < 0 || index >= 5) {
        throw createInvalidActionError("lock-dice", "Invalid dice index");
      }

      game?.lockDice(index);

      // Update activity in GameManager
      this.updateGameActivity(gameCode);

      // Broadcast dice locked to room
      this.context.eventService.broadcastDiceLocked(
        gameCode,
        socket.player!.id!,
        index
      );
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }
}
