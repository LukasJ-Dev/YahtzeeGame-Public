import { Socket, io } from "socket.io-client";
import { Dice, Lobby, LobbyPlayer, Player, Score } from "../types";

let SocketIO: Socket;

export const connectToSocket = () => {
  if (!SocketIO)
    SocketIO = io("http://localhost:8080", {
      transports: ["websocket"],
    });
};

export const onError = (callback: (message: string) => void): string => {
  if (!SocketIO || !callback) return "error";
  SocketIO.on("error", (message) => {
    callback(message);
  });
  return "error";
};

export const onPlayerJoin = (
  callback: (player: LobbyPlayer) => void
): string => {
  if (!SocketIO || !callback) return "player-join";
  SocketIO.on("player-join", (player) => {
    callback(player);
  });
  return "player-join";
};

export const onPlayerLeft = (callback: (lobby: Lobby) => void): string => {
  //TODO: Fix Type
  if (!SocketIO || !callback) return "player-left";
  SocketIO.on("player-left", (lobby) => {
    callback(lobby);
  });
  return "player-left";
};

export const onJoinLobbyError = (
  callback: (message: string) => void
): string => {
  //TODO: Fix Type
  if (!SocketIO || !callback) return "join-lobby-error";
  SocketIO.on("join-lobby-error", (message) => {
    callback(message);
  });
  return "join-lobby-error";
};

export const onJoinLobby = (
  callback: (game: Lobby, player: LobbyPlayer) => void
): string => {
  if (!SocketIO || !callback) return "join-lobby";
  SocketIO.on("join-lobby", (data) => {
    callback(data.game, data.player);
  });
  return "join-lobby";
};

export const onGameStarted = (
  callback: (players: Player[]) => void
): string => {
  if (!SocketIO || !callback) return "game-started";
  SocketIO.on("game-started", (players) => {
    callback(players);
  });
  return "game-started";
};

export const onDiceRolled = (callback: (dices: Dice[]) => void): string => {
  if (!SocketIO || !callback) return "dice-roll";
  SocketIO.on("dice-roll", (dices) => {
    callback(dices);
  });
  return "dice-roll";
};

export const onDiceLocked = (
  callback: (playerId: number, diceIndex: number) => void
): string => {
  if (!SocketIO || !callback) return "dice-locked";
  SocketIO.on(
    "dice-locked",
    ({ playerId, index }: { playerId: number; index: number }) => {
      callback(playerId, index);
    }
  );
  return "dice-locked";
};

export const onScoreSelected = (
  callback: (updatedScore: Score[]) => void
): string => {
  if (!SocketIO || !callback) return "score-selected";
  SocketIO.on("score-selected", (updatedScore: Score[]) => {
    callback(updatedScore);
  });
  return "score-selected";
};

export const onPlayerSkipped = (callback: () => void): string => {
  if (!SocketIO || !callback) return "player-skipped";
  SocketIO.on("player-skipped", () => {
    callback();
  });
  return "player-skipped";
};

export const onPlayerLeftInGame = (
  callback: (player: Player) => void
): string => {
  if (!SocketIO || !callback) return "player-left-ingame";
  SocketIO.on("player-left-ingame", (player) => {
    callback(player);
  });
  return "player-left-ingame";
};

export const removeEvents = (events: string[]) => {
  if (!SocketIO) return;
  events.map((event) => {
    SocketIO.off(event);
  });
};

export const host = (username: string) => {
  connectToSocket();
  SocketIO.emit("host-game", username);
};

export const join = (username: string, gameCode: string) => {
  connectToSocket();
  SocketIO.emit("join-game", { username, gameCode });
};

export const start = (gameCode: string) => {
  if (!SocketIO) return;
  SocketIO.emit("start-game", gameCode);
};

export const rollDice = () => {
  if (!SocketIO) return;
  SocketIO.emit("roll-dice");
};

export const lockDice = (index: number) => {
  if (!SocketIO) return;
  SocketIO.emit("lock-dice", index);
};

export const selectScore = (rowIndex: number) => {
  if (!SocketIO) return;
  SocketIO.emit("select-score", rowIndex);
};

export const skipTurn = () => {
  if (!SocketIO) return;
  SocketIO.emit("skip");
};
