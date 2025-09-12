import { Server, Socket } from "socket.io";
import { Player } from "./types";
import { Game } from "./Game";
import {
  ErrorHandler,
  CustomSocket,
  WebSocketError,
  ErrorCode,
  createValidationError,
  createGameNotFoundError,
  createPlayerNameTakenError,
  createGameAlreadyStartedError,
  createNotYourTurnError,
  createPlayerNotHostError,
  createInvalidActionError,
  ResponseBuilder,
  ValidationRules,
} from "./errors";
import { GameManager, PlayerService, EventService } from "./services";
import { HandlerManager, HandlerContext } from "./handlers";

export class SocketServer {
  private io: Server;
  private errorHandler: ErrorHandler;
  private gameManager: GameManager;
  private playerService: PlayerService;
  private eventService: EventService;
  private handlerManager: HandlerManager;

  constructor(io: Server) {
    this.io = io;
    this.errorHandler = new ErrorHandler();
    this.gameManager = new GameManager();
    this.playerService = new PlayerService();
    this.eventService = new EventService(io);

    // Initialize handler context
    const handlerContext: HandlerContext = {
      gameManager: this.gameManager,
      playerService: this.playerService,
      eventService: this.eventService,
      errorHandler: this.errorHandler,
    };

    this.handlerManager = new HandlerManager(handlerContext);
  }

  public start() {
    this.io.on("connection", (socket: CustomSocket) => {
      // Register all event handlers
      socket.on("host-game", async (username) =>
        this.handlerManager.handleEvent("host-game", socket, username)
      );

      socket.on("join-game", async (data) =>
        this.handlerManager.handleEvent("join-game", socket, data)
      );

      socket.on("start-game", () =>
        this.handlerManager.handleEvent("start-game", socket)
      );

      socket.on("roll-dice", () =>
        this.handlerManager.handleEvent("roll-dice", socket)
      );

      socket.on("lock-dice", async (index) =>
        this.handlerManager.handleEvent("lock-dice", socket, index)
      );

      socket.on("select-score", async (rowIndex) =>
        this.handlerManager.handleEvent("select-score", socket, rowIndex)
      );

      socket.on("skip", () => this.handlerManager.handleEvent("skip", socket));

      socket.on("disconnect", () =>
        this.handlerManager.handleEvent("disconnect", socket)
      );

      console.log("a user connected");
    });
  }
}
