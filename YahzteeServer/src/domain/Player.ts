import { Player as PlayerType, Dice, Score } from "../types";

export interface PlayerState {
  id: number;
  name: string;
  color: string;
  isHost: boolean;
  isConnected: boolean;
  dices: Dice[];
  scores: Score[];
  totalScore: number;
}

export class GamePlayer {
  private state: PlayerState;

  constructor(
    id: number,
    name: string,
    color: string,
    isHost: boolean = false
  ) {
    this.state = {
      id,
      name,
      color,
      isHost,
      isConnected: true,
      dices: this.initializeDice(),
      scores: this.initializeScores(),
      totalScore: 0,
    };
  }

  private initializeDice(): Dice[] {
    return [
      { value: 1, locked: false },
      { value: 2, locked: false },
      { value: 3, locked: false },
      { value: 4, locked: false },
      { value: 5, locked: false },
    ];
  }

  private initializeScores(): Score[] {
    return Array(13).fill({ score: 0, state: "DEFAULT" });
  }

  // Getters
  getId(): number {
    return this.state.id;
  }

  getName(): string {
    return this.state.name;
  }

  getColor(): string {
    return this.state.color;
  }

  isHost(): boolean {
    return this.state.isHost;
  }

  isConnected(): boolean {
    return this.state.isConnected;
  }

  getDices(): Dice[] {
    return [...this.state.dices];
  }

  getScores(): Score[] {
    return [...this.state.scores];
  }

  getTotalScore(): number {
    return this.state.totalScore;
  }

  // Game actions
  rollDice(): Dice[] {
    if (!this.state.isConnected) {
      throw new Error("Disconnected player cannot roll dice");
    }

    this.state.dices = this.state.dices.map((dice) => {
      if (dice.locked) return dice;
      return { value: Math.floor(Math.random() * 6) + 1, locked: false };
    });

    return this.getDices();
  }

  lockDice(index: number): Dice[] {
    if (index < 0 || index >= this.state.dices.length) {
      throw new Error("Invalid dice index");
    }

    this.state.dices[index].locked = !this.state.dices[index].locked;
    return this.getDices();
  }

  selectScore(rowIndex: number, score: number): Score[] {
    if (rowIndex < 0 || rowIndex >= this.state.scores.length) {
      throw new Error("Invalid score row index");
    }

    if (this.state.scores[rowIndex].state === "SELECTED") {
      throw new Error("Score already selected");
    }

    this.state.scores = this.state.scores.map((currentScore, index) => {
      if (index === rowIndex) {
        return { score, state: "SELECTED" };
      }
      return currentScore;
    });

    this.calculateTotalScore();
    return this.getScores();
  }

  private calculateTotalScore(): void {
    this.state.totalScore = this.state.scores
      .filter((score) => score.state === "SELECTED")
      .reduce((total, score) => total + score.score, 0);
  }

  disconnect(): void {
    this.state.isConnected = false;
  }

  reconnect(): void {
    this.state.isConnected = true;
  }

  setHost(isHost: boolean): void {
    this.state.isHost = isHost;
  }

  // Convert to legacy Player type for compatibility
  toLegacyPlayer(): PlayerType {
    return {
      id: this.state.id,
      name: this.state.name,
      color: this.state.color,
      isHost: this.state.isHost,
      disconnected: !this.state.isConnected,
      dices: this.state.dices,
      scores: this.state.scores,
    };
  }

  // Create from legacy Player type
  static fromLegacyPlayer(player: PlayerType, id: number): GamePlayer {
    const gamePlayer = new GamePlayer(
      id,
      player.name,
      player.color,
      player.isHost
    );
    if (player.dices) {
      gamePlayer.state.dices = player.dices;
    }
    if (player.scores) {
      gamePlayer.state.scores = player.scores;
    }
    if (player.disconnected) {
      gamePlayer.disconnect();
    }
    return gamePlayer;
  }
}
