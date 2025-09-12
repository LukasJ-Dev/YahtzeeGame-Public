import { Lobby, Player, Dice, Score } from "./types";
import { GameSession, GamePlayer } from "./domain";
import { GameRules } from "./domain/GameRules";

export class Game {
  private gameSession: GameSession;

  constructor(players: Player[], gameCode: string) {
    // Convert legacy players to GamePlayers
    const gamePlayers = players.map((player, index) =>
      GamePlayer.fromLegacyPlayer(player, index)
    );

    // Create game session with host player
    const hostPlayer = gamePlayers.find((p) => p.isHost()) || gamePlayers[0];
    this.gameSession = new GameSession(gameCode, hostPlayer);

    // Add remaining players
    gamePlayers.forEach((player) => {
      if (player !== hostPlayer) {
        this.gameSession.addPlayer(player);
      }
    });
  }

  // Game state queries
  hasGameStarted(): boolean {
    return this.gameSession.hasGameStarted();
  }

  getPlayers(): Player[] {
    return this.gameSession
      .getPlayers()
      .map((player) => player.toLegacyPlayer());
  }

  getPlayerTurn(): number {
    return this.gameSession.getPlayerTurn();
  }

  getPlayerByName(name: string): Player | undefined {
    const gamePlayer = this.gameSession.getPlayerByName(name);
    return gamePlayer ? gamePlayer.toLegacyPlayer() : undefined;
  }

  // Game actions
  rollDice(): Dice[] {
    const currentPlayer = this.gameSession.getCurrentPlayer();
    if (!currentPlayer) {
      throw new Error("No current player");
    }

    return this.gameSession.rollDice(currentPlayer.getName());
  }

  lockDice(index: number): Dice[] {
    const currentPlayer = this.gameSession.getCurrentPlayer();
    if (!currentPlayer) {
      throw new Error("No current player");
    }

    return this.gameSession.lockDice(currentPlayer.getName(), index);
  }

  selectScore(rowIndex: number): Score[] {
    const currentPlayer = this.gameSession.getCurrentPlayer();
    if (!currentPlayer) {
      throw new Error("No current player");
    }

    // Get current dice values
    const diceValues = currentPlayer.getDices().map((dice) => dice.value);

    // Calculate score using game rules
    const scoreCalculation = GameRules.calculateScore(diceValues, rowIndex);

    if (!scoreCalculation.isValid) {
      throw new Error(
        `Invalid score selection: ${scoreCalculation.description}`
      );
    }

    return this.gameSession.selectScore(
      currentPlayer.getName(),
      rowIndex,
      scoreCalculation.score
    );
  }

  skip(): boolean {
    const currentPlayer = this.gameSession.getCurrentPlayer();
    if (!currentPlayer) {
      throw new Error("No current player");
    }

    try {
      this.gameSession.skipTurn(currentPlayer.getName());
      return true;
    } catch (error) {
      return false;
    }
  }

  // Player management
  addPlayer(player: Player): void {
    const gamePlayer = GamePlayer.fromLegacyPlayer(
      player,
      this.gameSession.getPlayers().length
    );
    this.gameSession.addPlayer(gamePlayer);
  }

  removePlayer(deletePlayer: Player): number {
    return this.gameSession.removePlayer(deletePlayer.name);
  }

  disconnectPlayerInGame(leavingPlayer: Player): void {
    this.gameSession.disconnectPlayer(leavingPlayer.name);
  }

  // Game lifecycle
  startGame(): void {
    this.gameSession.startGame();
  }

  // Legacy compatibility
  getGame(): Lobby {
    return this.gameSession.toLobby();
  }

  // Additional utility methods
  getGameCode(): string {
    return this.gameSession.getGameCode();
  }

  getCurrentPlayer(): Player | undefined {
    const currentPlayer = this.gameSession.getCurrentPlayer();
    return currentPlayer ? currentPlayer.toLegacyPlayer() : undefined;
  }

  getGameState(): string {
    return this.gameSession.getState().getState().phase;
  }

  getTurnPhase(): string {
    return this.gameSession.getState().getState().turnPhase;
  }

  canRollDice(): boolean {
    return this.gameSession.getState().canRollDice();
  }

  canSelectScore(): boolean {
    return this.gameSession.getState().canSelectScore();
  }

  canSkipTurn(): boolean {
    return this.gameSession.getState().canSkipTurn();
  }

  getDiceRollCount(): number {
    return this.gameSession.getState().getState().diceRollCount;
  }

  // Get all possible scores for current dice
  getPossibleScores(): { score: number; description: string }[] {
    const currentPlayer = this.gameSession.getCurrentPlayer();
    if (!currentPlayer) {
      return [];
    }

    const diceValues = currentPlayer.getDices().map((dice) => dice.value);
    return GameRules.calculateAllScores(diceValues).map((calc) => ({
      score: calc.score,
      description: calc.description,
    }));
  }

  // Get game statistics
  getGameStats(): {
    totalPlayers: number;
    connectedPlayers: number;
    currentPlayer: string;
    gamePhase: string;
    turnPhase: string;
  } {
    const players = this.gameSession.getPlayers();
    const currentPlayer = this.gameSession.getCurrentPlayer();
    const state = this.gameSession.getState().getState();

    return {
      totalPlayers: players.length,
      connectedPlayers: players.filter((p) => p.isConnected()).length,
      currentPlayer: currentPlayer?.getName() || "None",
      gamePhase: state.phase,
      turnPhase: state.turnPhase,
    };
  }
}
