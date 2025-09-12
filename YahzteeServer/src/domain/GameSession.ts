import { GamePlayer } from "./Player";
import { GameStateManager, GamePhase } from "./GameState";
import { Lobby } from "../types";

export interface GameSessionData {
  gameCode: string;
  players: GamePlayer[];
  state: GameStateManager;
  createdAt: Date;
  lastActivity: Date;
}

export class GameSession {
  private data: GameSessionData;

  constructor(gameCode: string, hostPlayer: GamePlayer) {
    this.data = {
      gameCode,
      players: [hostPlayer],
      state: new GameStateManager(),
      createdAt: new Date(),
      lastActivity: new Date(),
    };
  }

  // Getters
  getGameCode(): string {
    return this.data.gameCode;
  }

  getPlayers(): GamePlayer[] {
    return [...this.data.players];
  }

  getState(): GameStateManager {
    return this.data.state;
  }

  getCreatedAt(): Date {
    return this.data.createdAt;
  }

  getLastActivity(): Date {
    return this.data.lastActivity;
  }

  // Player management
  addPlayer(player: GamePlayer): void {
    if (this.data.state.getState().phase !== GamePhase.LOBBY) {
      throw new Error("Cannot add players after game has started");
    }

    if (this.data.players.length >= 6) {
      throw new Error("Game is full");
    }

    // Check for duplicate names
    const existingPlayer = this.data.players.find(
      (p) => p.getName().toLowerCase() === player.getName().toLowerCase()
    );
    if (existingPlayer) {
      throw new Error("Player name already taken");
    }

    this.data.players.push(player);
    this.updateActivity();
  }

  removePlayer(playerName: string): number {
    const playerIndex = this.data.players.findIndex(
      (p) => p.getName() === playerName
    );
    if (playerIndex === -1) {
      throw new Error("Player not found");
    }

    const removedPlayer = this.data.players[playerIndex];
    this.data.players.splice(playerIndex, 1);

    // If host left and game hasn't started, assign new host
    if (
      removedPlayer.isHost() &&
      this.data.state.getState().phase === GamePhase.LOBBY
    ) {
      if (this.data.players.length > 0) {
        this.data.players[0].setHost(true);
      }
    }

    this.updateActivity();
    return this.data.players.length;
  }

  getPlayerByName(name: string): GamePlayer | undefined {
    return this.data.players.find((player) => player.getName() === name);
  }

  getPlayerById(id: number): GamePlayer | undefined {
    return this.data.players.find((player) => player.getId() === id);
  }

  getCurrentPlayer(): GamePlayer | undefined {
    const currentPlayerIndex = this.data.state.getState().currentPlayerIndex;
    return this.data.players[currentPlayerIndex];
  }

  // Game lifecycle
  startGame(): void {
    if (this.data.players.length < 1) {
      throw new Error("Cannot start game with no players");
    }

    if (this.data.state.getState().phase !== GamePhase.LOBBY) {
      throw new Error("Game has already started");
    }

    // Assign IDs to players
    this.data.players.forEach((player, index) => {
      // Reset player state for new game
      player.disconnect(); // Will be reconnected when they're active
    });

    this.data.state.startGame();
    this.data.state.setPlayerCount(this.data.players.length);
    this.updateActivity();
  }

  // Game actions
  rollDice(playerName: string): Dice[] {
    this.validateGameAction(playerName);

    const player = this.getPlayerByName(playerName);
    if (!player) {
      throw new Error("Player not found");
    }

    if (!this.data.state.canRollDice()) {
      throw new Error("Cannot roll dice at this time");
    }

    const dice = player.rollDice();
    this.data.state.rollDice();
    this.updateActivity();
    return dice;
  }

  lockDice(playerName: string, index: number): Dice[] {
    this.validateGameAction(playerName);

    const player = this.getPlayerByName(playerName);
    if (!player) {
      throw new Error("Player not found");
    }

    const dice = player.lockDice(index);
    this.updateActivity();
    return dice;
  }

  selectScore(playerName: string, rowIndex: number, score: number): Score[] {
    this.validateGameAction(playerName);

    const player = this.getPlayerByName(playerName);
    if (!player) {
      throw new Error("Player not found");
    }

    if (!this.data.state.canSelectScore()) {
      throw new Error("Cannot select score at this time");
    }

    const scores = player.selectScore(rowIndex, score);
    this.data.state.selectScore();
    this.updateActivity();
    return scores;
  }

  skipTurn(playerName: string): void {
    this.validateGameAction(playerName);

    if (!this.data.state.canSkipTurn()) {
      throw new Error("Cannot skip turn at this time");
    }

    this.data.state.skipTurn();
    this.updateActivity();
  }

  // Utility methods
  private validateGameAction(playerName: string): void {
    if (this.data.state.getState().phase !== GamePhase.ACTIVE) {
      throw new Error("Game is not active");
    }

    const currentPlayer = this.getCurrentPlayer();
    if (!currentPlayer || currentPlayer.getName() !== playerName) {
      throw new Error("It's not your turn");
    }
  }

  private updateActivity(): void {
    this.data.lastActivity = new Date();
  }

  // Legacy compatibility
  toLobby(): Lobby {
    return {
      gameCode: this.data.gameCode,
      players: this.data.players.map((player) => player.toLegacyPlayer()),
    };
  }

  hasGameStarted(): boolean {
    return this.data.state.getState().phase !== GamePhase.LOBBY;
  }

  getPlayerTurn(): number {
    return this.data.state.getState().currentPlayerIndex;
  }

  // Disconnect player during game
  disconnectPlayer(playerName: string): void {
    const player = this.getPlayerByName(playerName);
    if (player) {
      player.disconnect();
      this.updateActivity();
    }
  }
}
