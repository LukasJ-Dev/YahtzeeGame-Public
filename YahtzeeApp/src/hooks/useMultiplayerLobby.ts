import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { gameAction } from "../store/game/gameSlice";
import {
  onGameStarted,
  onPlayerJoin,
  onPlayerLeft,
  removeEvents,
} from "../socket/Socket";

export function useMultiplayerLobby() {
  const dispatch = useDispatch();

  useEffect(() => {
    const playerJoinEvent = onPlayerJoin((player) => {
      dispatch(gameAction.newPlayerJoin(player));
    });

    const playerLeftEvent = onPlayerLeft((lobby) => {
      dispatch(gameAction.setLobby(lobby));
    });

    const gameStartedEvent = onGameStarted((players) => {
      dispatch(gameAction.startGame(players));
    });
    return () => {
      removeEvents([playerJoinEvent, playerLeftEvent, gameStartedEvent]);
    };
  }, [dispatch]);
}
