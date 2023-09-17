import { GameState, Player } from "../../types";

export const selectGameStarted = (state: GameState) => state.gameStarted;

export const selectPlayers = (state: GameState) => state.players;

export const selectPlayerTurn = (state: GameState) => state.playerTurn;

export const selectDiceRolls = (state: GameState) => state.diceState.diceRolled;

export const selectIsRolling = (state: GameState) => state.diceState.isRolling;

export const selectLobby = (state: GameState) => state.lobby;
export const selectHostPlayerName = (state: GameState) =>
  state.lobby.players.find((player) => player.isHost)?.name;

export const selectMyPlayerName = (state: GameState) => state.myPlayerName;

export const selectMyPlayer = (state: GameState): Player =>
  state.players.filter((player) => player.name === state.myPlayerName)[0];

export const selectIsMyTurn = (state: GameState) =>
  !state.isMultiplayer || selectMyPlayer(state).id === state.playerTurn;

export const selectIsMultiplayer = (state: GameState) => state.isMultiplayer;

export const selectDices = (state: GameState) =>
  state.players[state.playerTurn].dices;

export const selectPlayer = (state: GameState) =>
  state.players[state.playerTurn];
export const selectPlayerName = (state: GameState) =>
  state.players[state.playerTurn].name;
