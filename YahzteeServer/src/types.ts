import { Socket } from "socket.io";
import { Game } from "./Game";

export interface Score {
  score: number;
  state: "DEFAULT" | "LOCKED" | "ROLLING" | "FLASHING" | "SELECTED";
}

export interface Dice {
  value: number;
  locked: boolean;
}

export interface Player {
  name: string;
  color: string;

  id?: number;
  dices?: Dice[];
  scores?: Score[];

  isHost?: boolean;

  disconnected?: boolean;
}

export interface Lobby {
  gameCode: string;
  players: Player[];
}

export interface GameState {
  lobby: Lobby; //TODO: FIX TYPES
  myPlayerName: string;
  isMultiplayer: boolean;
  gameStarted: boolean;
  diceState: {
    diceRolled: number;
    isRolling: boolean;
  };
  players: Player[];
  playerTurn: number;
}
