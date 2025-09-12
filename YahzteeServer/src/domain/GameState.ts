export enum GamePhase {
  LOBBY = "LOBBY",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export enum TurnPhase {
  WAITING = "WAITING",
  ROLLING = "ROLLING",
  SELECTING = "SELECTING",
}

export interface GameState {
  phase: GamePhase;
  turnPhase: TurnPhase;
  currentPlayerIndex: number;
  diceRollCount: number;
  isGameComplete: boolean;
}

export class GameStateManager {
  private state: GameState;

  constructor() {
    this.state = {
      phase: GamePhase.LOBBY,
      turnPhase: TurnPhase.WAITING,
      currentPlayerIndex: 0,
      diceRollCount: 0,
      isGameComplete: false,
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  startGame(): void {
    if (this.state.phase !== GamePhase.LOBBY) {
      throw new Error("Game can only be started from lobby phase");
    }
    this.state.phase = GamePhase.ACTIVE;
    this.state.turnPhase = TurnPhase.ROLLING;
    this.state.currentPlayerIndex = 0;
    this.state.diceRollCount = 0;
  }

  startTurn(): void {
    if (this.state.phase !== GamePhase.ACTIVE) {
      throw new Error("Turn can only be started in active game");
    }
    this.state.turnPhase = TurnPhase.ROLLING;
    this.state.diceRollCount = 0;
  }

  rollDice(): void {
    if (this.state.turnPhase !== TurnPhase.ROLLING) {
      throw new Error("Dice can only be rolled in rolling phase");
    }
    this.state.diceRollCount++;
    if (this.state.diceRollCount >= 3) {
      this.state.turnPhase = TurnPhase.SELECTING;
    }
  }

  selectScore(): void {
    if (this.state.turnPhase !== TurnPhase.SELECTING) {
      throw new Error("Score can only be selected in selecting phase");
    }
    this.nextPlayer();
  }

  skipTurn(): void {
    if (this.state.diceRollCount === 0) {
      throw new Error("Cannot skip turn without rolling dice");
    }
    this.nextPlayer();
  }

  private nextPlayer(): void {
    this.state.currentPlayerIndex++;
    this.state.turnPhase = TurnPhase.ROLLING;
    this.state.diceRollCount = 0;
  }

  setPlayerCount(playerCount: number): void {
    if (this.state.currentPlayerIndex >= playerCount) {
      this.state.currentPlayerIndex = 0;
    }
  }

  isCurrentPlayer(playerIndex: number): boolean {
    return this.state.currentPlayerIndex === playerIndex;
  }

  canRollDice(): boolean {
    return (
      this.state.phase === GamePhase.ACTIVE &&
      this.state.turnPhase === TurnPhase.ROLLING &&
      this.state.diceRollCount < 3
    );
  }

  canSelectScore(): boolean {
    return (
      this.state.phase === GamePhase.ACTIVE &&
      this.state.turnPhase === TurnPhase.SELECTING
    );
  }

  canSkipTurn(): boolean {
    return (
      this.state.phase === GamePhase.ACTIVE && this.state.diceRollCount > 0
    );
  }

  finishGame(): void {
    this.state.phase = GamePhase.FINISHED;
    this.state.turnPhase = TurnPhase.WAITING;
  }
}
