import { Player } from "../types";
import { randomColor, getColorsFromPlayers } from "../utils/random";
import {
  WebSocketError,
  ErrorCode,
  createValidationError,
  createPlayerNameTakenError,
} from "../errors";

export interface CreatePlayerOptions {
  name: string;
  isHost?: boolean;
  usedColors?: string[];
}

export class PlayerService {
  private readonly MAX_USERNAME_LENGTH = 20;
  private readonly MIN_USERNAME_LENGTH = 1;

  /**
   * Create a new player with validation
   */
  public createPlayer(options: CreatePlayerOptions): Player {
    const { name, isHost = false, usedColors = [] } = options;

    // Validate player name
    this.validatePlayerName(name);

    // Generate unique color
    const color = randomColor(usedColors);

    return {
      name: name.trim(),
      color,
      isHost,
    };
  }

  /**
   * Validate player name
   */
  public validatePlayerName(name: string): void {
    if (!name || typeof name !== "string") {
      throw createValidationError("Player name is required");
    }

    const trimmedName = name.trim();

    if (trimmedName.length < this.MIN_USERNAME_LENGTH) {
      throw createValidationError(
        `Player name must be at least ${this.MIN_USERNAME_LENGTH} character long`
      );
    }

    if (trimmedName.length > this.MAX_USERNAME_LENGTH) {
      throw createValidationError(
        `Player name must be no more than ${this.MAX_USERNAME_LENGTH} characters long`
      );
    }

    // Check for invalid characters (basic validation)
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      throw createValidationError(
        "Player name can only contain letters, numbers, spaces, hyphens, and underscores"
      );
    }
  }

  /**
   * Check if player name is available in a game
   */
  public isPlayerNameAvailable(
    playerName: string,
    existingPlayers: Player[]
  ): boolean {
    return !existingPlayers.some(
      (player) => player.name.toLowerCase() === playerName.toLowerCase()
    );
  }

  /**
   * Validate player name availability
   */
  public validatePlayerNameAvailability(
    playerName: string,
    existingPlayers: Player[]
  ): void {
    if (!this.isPlayerNameAvailable(playerName, existingPlayers)) {
      throw createPlayerNameTakenError(playerName);
    }
  }

  /**
   * Find player by name in a list of players
   */
  public findPlayerByName(
    playerName: string,
    players: Player[]
  ): Player | undefined {
    return players.find((player) => player.name === playerName);
  }

  /**
   * Get all used colors from a list of players
   */
  public getUsedColors(players: Player[]): string[] {
    return getColorsFromPlayers(players);
  }

  /**
   * Create a host player
   */
  public createHostPlayer(name: string): Player {
    return this.createPlayer({ name, isHost: true });
  }

  /**
   * Create a regular player
   */
  public createRegularPlayer(name: string, usedColors: string[]): Player {
    return this.createPlayer({ name, isHost: false, usedColors });
  }
}
