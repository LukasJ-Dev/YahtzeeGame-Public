import { Server } from "socket.io";
import { Player, Lobby, Dice, Score } from "../types";
import { ResponseBuilder } from "../errors";

export interface CustomSocket {
  gameCode?: string;
  player?: Player;
  join(room: string): void;
  leave(room: string): void;
  emit(event: string, data: any): void;
}

export class EventService {
  constructor(private io: Server) {}

  /**
   * Emit game created event to the host
   */
  public emitGameCreated(
    socket: CustomSocket,
    gameData: { game: Lobby; player: Player }
  ): void {
    socket.emit("join-lobby", ResponseBuilder.success(gameData));
  }

  /**
   * Emit player joined event to the joining player
   */
  public emitPlayerJoined(
    socket: CustomSocket,
    gameData: { game: Lobby; player: Player }
  ): void {
    socket.emit("join-lobby", ResponseBuilder.success(gameData));
  }

  /**
   * Broadcast player joined to room
   */
  public broadcastPlayerJoined(gameCode: string, player: Player): void {
    this.io
      .to(gameCode)
      .emit("player-join", ResponseBuilder.success({ player }));
  }

  /**
   * Broadcast game started to room
   */
  public broadcastGameStarted(gameCode: string, players: Player[]): void {
    this.io
      .to(gameCode)
      .emit("game-started", ResponseBuilder.success({ players }));
  }

  /**
   * Broadcast dice rolled to room
   */
  public broadcastDiceRolled(gameCode: string, dice: Dice[]): void {
    this.io.to(gameCode).emit("dice-roll", ResponseBuilder.success({ dice }));
  }

  /**
   * Broadcast dice locked to room
   */
  public broadcastDiceLocked(
    gameCode: string,
    playerId: number,
    index: number
  ): void {
    this.io.to(gameCode).emit(
      "dice-locked",
      ResponseBuilder.success({
        playerId,
        index,
      })
    );
  }

  /**
   * Broadcast score selected to room
   */
  public broadcastScoreSelected(gameCode: string, scores: Score[]): void {
    this.io
      .to(gameCode)
      .emit("score-selected", ResponseBuilder.success({ scores }));
  }

  /**
   * Broadcast player skipped to room
   */
  public broadcastPlayerSkipped(gameCode: string, playerId: number): void {
    this.io
      .to(gameCode)
      .emit("player-skipped", ResponseBuilder.success({ playerId }));
  }

  /**
   * Broadcast player left (lobby) to room
   */
  public broadcastPlayerLeft(gameCode: string, game: Lobby): void {
    this.io.to(gameCode).emit("player-left", ResponseBuilder.success({ game }));
  }

  /**
   * Broadcast player left (in game) to room
   */
  public broadcastPlayerLeftInGame(gameCode: string, player: Player): void {
    this.io
      .to(gameCode)
      .emit("player-left-ingame", ResponseBuilder.success({ player }));
  }

  /**
   * Emit error to specific socket
   */
  public emitError(socket: CustomSocket, error: any): void {
    socket.emit("error", error);
  }

  /**
   * Broadcast error to room
   */
  public broadcastError(gameCode: string, error: any): void {
    this.io.to(gameCode).emit("error", error);
  }

  /**
   * Join socket to game room
   */
  public joinGameRoom(socket: CustomSocket, gameCode: string): void {
    socket.join(gameCode);
  }

  /**
   * Leave socket from game room
   */
  public leaveGameRoom(socket: CustomSocket, gameCode: string): void {
    socket.leave(gameCode);
  }

  /**
   * Get room size (number of connected sockets)
   */
  public getRoomSize(gameCode: string): number {
    const room = this.io.sockets.adapter.rooms.get(gameCode);
    return room ? room.size : 0;
  }

  /**
   * Check if room exists
   */
  public roomExists(gameCode: string): boolean {
    return this.io.sockets.adapter.rooms.has(gameCode);
  }
}
