import { BaseHandler, HandlerContext } from "./BaseHandler";
import { CustomSocket } from "../errors";
import { ValidationRules } from "../errors";

export class HostGameHandler extends BaseHandler {
  async handle(socket: CustomSocket, username: string): Promise<void> {
    try {
      // Validate input
      this.context.errorHandler.validateInput({ username }, [
        ValidationRules.required("username"),
        ValidationRules.minLength("username", 1),
        ValidationRules.maxLength("username", 20),
      ]);

      // Create host player
      const hostPlayer = this.context.playerService.createHostPlayer(username);

      // Create game
      const { gameSession } = this.context.gameManager.createGame(hostPlayer);

      // Set socket properties
      socket.player = hostPlayer;
      socket.gameCode = gameSession.gameCode;

      // Join game room
      this.context.eventService.joinGameRoom(socket, gameSession.gameCode);

      // Emit success response
      this.context.eventService.emitGameCreated(socket, {
        game: gameSession.game.getGame(),
        player: hostPlayer,
      });
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }
}

export class JoinGameHandler extends BaseHandler {
  async handle(
    socket: CustomSocket,
    data: { gameCode: string; username: string }
  ): Promise<void> {
    try {
      const { gameCode, username } = data;

      // Validate input
      this.context.errorHandler.validateInput({ username, gameCode }, [
        ValidationRules.required("username"),
        ValidationRules.required("gameCode"),
        ValidationRules.minLength("username", 1),
        ValidationRules.maxLength("username", 20),
        ValidationRules.gameCode(),
      ]);

      // Get existing game to check for name conflicts
      const existingGame = this.context.gameManager.getGame(gameCode);
      const usedColors = this.context.playerService.getUsedColors(
        existingGame.getPlayers()
      );

      // Validate player name availability
      this.context.playerService.validatePlayerNameAvailability(
        username,
        existingGame.getPlayers()
      );

      // Create player
      const player = this.context.playerService.createRegularPlayer(
        username,
        usedColors
      );

      // Join game
      const { gameSession } = this.context.gameManager.joinGame(
        gameCode,
        player
      );

      // Set socket properties
      socket.player = player;
      socket.gameCode = gameCode;

      // Join game room
      this.context.eventService.joinGameRoom(socket, gameCode);

      // Emit success response to joining player
      this.context.eventService.emitPlayerJoined(socket, {
        game: gameSession.game.getGame(),
        player,
      });

      // Broadcast player joined to room
      this.context.eventService.broadcastPlayerJoined(gameCode, player);
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }
}

export class StartGameHandler extends BaseHandler {
  async handle(socket: CustomSocket): Promise<void> {
    try {
      const gameCode = this.validateSocketConnection(socket);
      const player = this.validateSocketPlayer(socket);

      if (!player.name) {
        throw new Error("Player name not found");
      }

      // Start game through GameManager
      this.context.gameManager.startGame(gameCode, player.name);

      // Get updated game state
      const game = this.context.gameManager.getGame(gameCode);

      // Broadcast game started to room
      this.context.eventService.broadcastGameStarted(
        gameCode,
        game.getPlayers()
      );
    } catch (error) {
      this.handleError(socket, error as Error);
    }
  }
}
