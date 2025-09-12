import { HandlerContext } from "./BaseHandler";
import {
  HostGameHandler,
  JoinGameHandler,
  StartGameHandler,
} from "./GameHandlers";
import { RollDiceHandler, LockDiceHandler } from "./DiceHandlers";
import { SelectScoreHandler, SkipTurnHandler } from "./ScoreHandlers";
import { DisconnectHandler } from "./PlayerHandlers";
import { CustomSocket } from "../errors";

export class HandlerManager {
  private handlers: Map<string, any> = new Map();

  constructor(context: HandlerContext) {
    this.initializeHandlers(context);
  }

  private initializeHandlers(context: HandlerContext): void {
    // Game handlers
    this.handlers.set("host-game", new HostGameHandler(context));
    this.handlers.set("join-game", new JoinGameHandler(context));
    this.handlers.set("start-game", new StartGameHandler(context));

    // Dice handlers
    this.handlers.set("roll-dice", new RollDiceHandler(context));
    this.handlers.set("lock-dice", new LockDiceHandler(context));

    // Score handlers
    this.handlers.set("select-score", new SelectScoreHandler(context));
    this.handlers.set("skip", new SkipTurnHandler(context));

    // Player handlers
    this.handlers.set("disconnect", new DisconnectHandler(context));
  }

  /**
   * Handle a socket event
   */
  public async handleEvent(
    eventName: string,
    socket: CustomSocket,
    data?: any
  ): Promise<void> {
    const handler = this.handlers.get(eventName);

    if (!handler) {
      console.warn(`No handler found for event: ${eventName}`);
      return;
    }

    try {
      await handler.handle(socket, data);
    } catch (error) {
      console.error(`Error in handler for event ${eventName}:`, error);
      // The individual handlers should handle their own errors, but this is a fallback
    }
  }

  /**
   * Get all registered event names
   */
  public getRegisteredEvents(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Check if an event has a handler
   */
  public hasHandler(eventName: string): boolean {
    return this.handlers.has(eventName);
  }
}
