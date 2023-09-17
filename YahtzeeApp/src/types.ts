export interface Score {
  score: number;
  state: "DEFAULT" | "LOCKED" | "ROLLING" | "FLASHING" | "SELECTED";
}

export interface Dice {
  value: number;
  locked: boolean;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  dices: Dice[];
  scores: Score[];
  disconnected?: boolean;
}

export interface LobbyPlayer {
  name: string;
  color: string;
  isHost: boolean;
}

export interface Lobby {
  gameCode: string;
  players: LobbyPlayer[];
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
