import { Game } from "../Game";
import { Player, Lobby } from "../types";
import {
  WebSocketError,
  ErrorCode,
  createGameNotFoundError,
  createGameAlreadyStartedError,
  createPlayerNameTakenError,
  createPlayerNotHostError,
} from "../errors";
import {
  GenerateRandomGameCode,
  randomColor,
  getColorsFromPlayers,
} from "../utils/random";

export interface GameSession {
  gameCode: string;
  game: Game;
  createdAt: Date;
  lastActivity: Date;
}

export interface CreateGameResult {
  gameSession: GameSession;
  hostPlayer: Player;
}

export interface JoinGameResult {
  gameSession: GameSession;
  player: Player;
}

export class GameManager {
  private games: Map<string, GameSession> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly GAME_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.startCleanup();
  }

  /**
   * Create a new game with a host player
   */
  public createGame(hostPlayer: Player, io?: any): CreateGameResult {
    // Generate unique game code
    let gameCode = GenerateRandomGameCode();
    while (
      this.games.has(gameCode) ||
      (io && io.sockets.adapter.rooms.get(gameCode) !== undefined)
    ) {
      gameCode = GenerateRandomGameCode();
    }

    // Create game instance
    const game = new Game([hostPlayer], gameCode);

    // Create game session
    const gameSession: GameSession = {
      gameCode,
      game,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    // Store game session
    this.games.set(gameCode, gameSession);

    return {
      gameSession,
      hostPlayer,
    };
  }

  /**
   * Join an existing game
   */
  public joinGame(gameCode: string, player: Player): JoinGameResult {
    const gameSession = this.games.get(gameCode);

    if (!gameSession) {
      throw createGameNotFoundError(gameCode);
    }

    if (gameSession.game.hasGameStarted()) {
      throw createGameAlreadyStartedError();
    }

    // Check if player name is already taken
    const existingPlayer = gameSession.game
      .getPlayers()
      .find((p) => p.name === player.name);
    if (existingPlayer) {
      throw createPlayerNameTakenError(player.name);
    }

    // Add player to game
    gameSession.game.addPlayer(player);
    gameSession.lastActivity = new Date();

    return {
      gameSession,
      player,
    };
  }

  /**
   * Start a game (only host can do this)
   */
  public startGame(gameCode: string, playerId: string): void {
    const gameSession = this.getGameSession(gameCode);

    // Find the player and check if they're the host
    const player = gameSession.game
      .getPlayers()
      .find((p) => p.name === playerId);
    if (!player || !player.isHost) {
      throw createPlayerNotHostError();
    }

    gameSession.game.startGame();
    gameSession.lastActivity = new Date();
  }

  /**
   * Get a game session by game code
   */
  public getGameSession(gameCode: string): GameSession {
    const gameSession = this.games.get(gameCode);
    if (!gameSession) {
      throw createGameNotFoundError(gameCode);
    }
    return gameSession;
  }

  /**
   * Get a game by game code
   */
  public getGame(gameCode: string): Game {
    return this.getGameSession(gameCode).game;
  }

  /**
   * Check if a game exists
   */
  public hasGame(gameCode: string): boolean {
    return this.games.has(gameCode);
  }

  /**
   * Remove a player from a game
   */
  public removePlayer(gameCode: string, player: Player): number {
    const gameSession = this.getGameSession(gameCode);
    const remainingPlayers = gameSession.game.removePlayer(player) || 0;

    // If no players left, delete the game
    if (remainingPlayers === 0) {
      this.games.delete(gameCode);
    } else {
      gameSession.lastActivity = new Date();
    }

    return remainingPlayers;
  }

  /**
   * Disconnect a player from a game (during gameplay)
   */
  public disconnectPlayer(gameCode: string, player: Player): void {
    const gameSession = this.getGameSession(gameCode);
    gameSession.game.disconnectPlayerInGame(player);
    gameSession.lastActivity = new Date();
  }

  /**
   * Get all active games (for monitoring/debugging)
   */
  public getAllGames(): GameSession[] {
    return Array.from(this.games.values());
  }

  /**
   * Get game statistics
   */
  public getGameStats(): { totalGames: number; activeGames: number } {
    const totalGames = this.games.size;
    const activeGames = Array.from(this.games.values()).filter((session) =>
      session.game.hasGameStarted()
    ).length;

    return { totalGames, activeGames };
  }

  /**
   * Clean up abandoned games
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupAbandonedGames();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private cleanupAbandonedGames(): void {
    const now = Date.now();
    const abandonedGames: string[] = [];

    for (const [gameCode, gameSession] of this.games) {
      const timeSinceActivity = now - gameSession.lastActivity.getTime();

      // Remove games that haven't been active for 30 minutes
      if (timeSinceActivity > this.GAME_TIMEOUT) {
        abandonedGames.push(gameCode);
      }
    }

    // Remove abandoned games
    abandonedGames.forEach((gameCode) => {
      this.games.delete(gameCode);
      console.log(`Cleaned up abandoned game: ${gameCode}`);
    });

    if (abandonedGames.length > 0) {
      console.log(`Cleaned up ${abandonedGames.length} abandoned games`);
    }
  }

  /**
   * Stop cleanup interval (for testing or shutdown)
   */
  public stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Update last activity for a game
   */
  public updateActivity(gameCode: string): void {
    const gameSession = this.games.get(gameCode);
    if (gameSession) {
      gameSession.lastActivity = new Date();
    }
  }
}
