import { Server, Socket } from "socket.io";
import {
  GenerateRandomGameCode,
  randomColor,
  getColorsFromPlayers,
} from "./utils/random";
import { Player } from "./types";
import { Game } from "./Game";

interface CustomSocket extends Socket {
  game?: Game;
  player?: Player;
  gameCode?: string;
}

export class SocketServer {
  private games: Map<string, Game> = new Map();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public start() {
    this.io.on("connection", (socket: CustomSocket) => {
      socket.on("host-game", async (username) =>
        this.hostGame(socket, username)
      );

      socket.on("join-game", async (data) => this.joinGame(socket, data));

      socket.on("start-game", () => this.startGame(socket));

      socket.on("roll-dice", () => this.rollDice(socket));

      socket.on("lock-dice", async (index) => this.lockDice(socket, index));

      socket.on("select-score", async (rowIndex) =>
        this.selectScore(socket, rowIndex)
      );

      socket.on("skip", () => this.skip(socket));

      socket.on("disconnect", () => this.disconnect(socket));
      console.log("a user connected");
    });
  }

  private hostGame(socket: CustomSocket, username: string) {
    let gameCode = GenerateRandomGameCode();
    while (this.io.sockets.adapter.rooms.get(gameCode) !== undefined)
      gameCode = GenerateRandomGameCode();

    if (!username.trim().length) {
      return socket.emit("join-lobby-error", "Please enter a username");
    }

    const player: Player = {
      name: username,
      color: randomColor(),
      isHost: true,
    };

    socket.player = player;

    socket.gameCode = gameCode;

    this.games.set(gameCode, new Game([player], gameCode)); //{players: [player], gameCode}

    socket.join(gameCode);
    socket.emit("join-lobby", {
      game: this.games.get(gameCode)?.getGame(),
      player,
    });
  }

  private joinGame(
    socket: CustomSocket,
    data: { gameCode: string; username: string }
  ) {
    const { gameCode, username } = data;

    if (!username.trim().length) {
      return socket.emit("join-lobby-error", "Please enter a username");
    }

    const game: Game | undefined = this.games.get(gameCode);

    if (!game) {
      return socket.emit("join-lobby-error", "Wrong game code");
    }

    if (game.hasGameStarted())
      return socket.emit("join-lobby-error", "Game already started");

    for (let i = 0; i < game.getPlayers().length; i++) {
      if (game.getPlayers()[i].name === username) {
        return socket.emit("join-lobby-error", "Name used in this game");
      }
    }

    const player = {
      name: username,
      color: randomColor(getColorsFromPlayers(game.getPlayers())),
      isHost: false,
    };

    socket.player = player;

    socket.gameCode = gameCode;

    game.addPlayer(player);

    socket.join(gameCode);
    socket.emit("join-lobby", { game: game.getGame(), player });
    this.io.to(gameCode).emit("player-join", player);
  }

  private socketToGame(socket: CustomSocket): Game | undefined {
    const gameCode = socket.gameCode;
    if (!gameCode) {
      socket.emit("error", "Not connected to any game");
      return;
    }

    const game = this.games.get(gameCode);
    if (!game) {
      socket.emit("error", "Game does not exist");
      return;
    }
    return game;
  }

  private startGame(socket: CustomSocket) {
    /*
    const gameCode = socket.gameCode;
    if (!gameCode) return socket.emit("error", "Not connected to any game");
    if (!socket.player?.isHost)
      return socket.emit("error", "You are not the host");

    const game = this.games.get(gameCode);
    if (!game) {
      socket.emit("error", "Game does not exist");
      return;
    }*/
    const game = this.socketToGame(socket);
    if (!game) return;
    if (!socket.player?.isHost)
      return socket.emit("warning", "You are not the host");
    game.startGame();
    this.io.to(game.getGame().gameCode).emit("game-started", game.getPlayers());
  }

  private rollDice(socket: CustomSocket) {
    const game = this.socketToGame(socket);
    if (!game) return socket.emit("error", "The game does not exist anymore");

    socket.player =
      game.getPlayerByName(socket.player?.name || "") || socket.player;
    if (game.getPlayerTurn() !== socket.player?.id)
      return socket.emit("warning", "Its not your turn");
    const newDice = game?.rollDice();

    if (!newDice || newDice.length === 0)
      return socket.emit("warning", "Couldn't roll the dices");

    this.io.to(game.getGame().gameCode).emit("dice-roll", newDice);
  }

  private lockDice(socket: CustomSocket, index: number) {
    const game = this.socketToGame(socket);
    if (!game) return socket.emit("error", "The game does not exist anymore");

    socket.player =
      game.getPlayerByName(socket.player?.name || "") || socket.player;
    if (game.getPlayerTurn() !== socket.player?.id)
      return socket.emit("warning", "Its not your turn");

    game?.lockDice(index);

    this.io
      .to(game.getGame().gameCode)
      .emit("dice-locked", { playerId: socket.player!.id, index });
  }

  private selectScore(socket: CustomSocket, rowIndex: number) {
    const game = this.socketToGame(socket);
    if (!game) return socket.emit("error", "The game does not exist anymore");

    socket.player =
      game.getPlayerByName(socket.player?.name || "") || socket.player;
    if (game.getPlayerTurn() !== socket.player?.id)
      return socket.emit("warning", "Its not your turn");

    const newScore = game.selectScore(rowIndex);
    if (!newScore) return socket.emit("warning", "Couldn't pick the score");

    this.io.to(game.getGame().gameCode).emit("score-selected", newScore);
  }

  private skip(socket: CustomSocket) {
    const game = this.socketToGame(socket);
    if (!game) return socket.emit("error", "The game does not exist anymore");

    socket.player =
      game.getPlayerByName(socket.player?.name || "") || socket.player;
    if (game.getPlayerTurn() !== socket.player?.id)
      return socket.emit("warning", "Its not your turn");

    const skip = game.skip();

    if (!skip) return socket.emit("warning", "Couldn't skip");

    this.io.to(game.getGame().gameCode).emit("player-skipped");
  }

  private disconnect(socket: CustomSocket) {
    const gameCode = socket.gameCode;
    const player = socket.player;
    if (!player || !gameCode) return;

    const game = this.games.get(gameCode);

    if (!game) return;

    if (game.hasGameStarted()) {
      game.disconnectPlayerInGame(player);
      return this.io.to(gameCode).emit("player-left-ingame", player);
    }
    game.removePlayer(player);

    if (game.removePlayer(player) === 0) {
      this.games.delete(gameCode);
      return;
    }
    this.io.to(gameCode).emit("player-left", game.getGame());
  }
}
