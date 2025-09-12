import { BaseHandler, HandlerContext } from "./BaseHandler";
import { CustomSocket } from "../errors";

export class DisconnectHandler extends BaseHandler {
  async handle(socket: CustomSocket): Promise<void> {
    try {
      const gameCode = socket.gameCode;
      const player = socket.player;

      if (!player || !gameCode) return;

      try {
        const game = this.context.gameManager.getGame(gameCode);

        if (game.hasGameStarted()) {
          // Player left during game
          this.context.gameManager.disconnectPlayer(gameCode, player);
          this.context.eventService.broadcastPlayerLeftInGame(gameCode, player);
        } else {
          // Player left from lobby
          const remainingPlayers = this.context.gameManager.removePlayer(
            gameCode,
            player
          );

          if (remainingPlayers > 0) {
            // Broadcast player left to remaining players
            this.context.eventService.broadcastPlayerLeft(
              gameCode,
              game.getGame()
            );
          }
        }
      } catch (error) {
        // Game might not exist anymore, which is fine for disconnection
        console.log(
          `Player ${player.name} disconnected from non-existent game ${gameCode}`
        );
      }
    } catch (error) {
      // Log disconnect errors but don't emit to client since they're disconnecting
      console.error("Error during disconnect:", error);
    }
  }
}
