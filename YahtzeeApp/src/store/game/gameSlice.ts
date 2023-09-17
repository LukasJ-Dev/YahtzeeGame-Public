import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GameState, Lobby, LobbyPlayer, Score } from "../../types";

const initialState: GameState = {
  lobby: { players: [], gameCode: "" },
  myPlayerName: "",

  isMultiplayer: false,
  gameStarted: false,
  diceState: {
    diceRolled: 0,
    isRolling: false,
  },
  players: [],
  playerTurn: 0,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame(state, action) {
      state.gameStarted = true;
      state.players = action.payload;
    },
    startRollDice(state: GameState) {
      if (!state.gameStarted) return;
      if (state.diceState.isRolling) return;
      if (state.diceState.diceRolled >= 3) return;
      state.diceState.isRolling = true;
      state.diceState.diceRolled++;
    },
    rollDiceAnimation(state: GameState, action) {
      if (!state.diceState.isRolling) return;
      const player = state.players[state.playerTurn];

      const newDice = player.dices.map((dice, i) => {
        if (dice.locked) return dice;
        return action.payload[i];
      });

      state.players[state.playerTurn].dices = newDice;
    },
    finishRollDice(state, action) {
      if (!state.diceState.isRolling) return;
      state.diceState.isRolling = false;

      const player = state.players[state.playerTurn];

      const newDice = player.dices.map((dice, i) => {
        if (dice.locked) return dice;
        return action.payload[i];
      });

      state.players[state.playerTurn].dices = newDice;
    },
    lockDice(state, action) {
      if (!state.gameStarted) return;
      if (state.playerTurn !== action.payload.playerId) return;
      if (state.diceState.isRolling) return;
      if (state.diceState.diceRolled === 0) return;
      state.players[state.playerTurn].dices[action.payload.diceIndex].locked =
        !state.players[state.playerTurn].dices[action.payload.diceIndex].locked;
    },

    updateScore(state, action: PayloadAction<Score[]>) {
      if (state.diceState.diceRolled === 0) return;
      const prevScore = state.players[state.playerTurn].scores;
      const newScore: Score[] = prevScore.map((score, index) => {
        if (score.state === "SELECTED") return score;
        if (action.payload[index].score == 0)
          return {
            score: action.payload[index].score,
            state: "DEFAULT",
          };
        if (state.diceState.isRolling)
          return {
            score: action.payload[index].score,
            state: "ROLLING",
          };
        return {
          score: action.payload[index].score,
          state: "FLASHING",
        };
      });
      state.players[state.playerTurn].scores = newScore;
    },

    setScoreTable(state, action: PayloadAction<Score[]>) {
      if (state.diceState.diceRolled === 0) return;
      state.players[state.playerTurn].scores = action.payload;
      state.diceState.diceRolled = 0;

      let nextPlayerTurn = (state.playerTurn + 1) % state.players.length;

      while (state.players[nextPlayerTurn].disconnected) {
        nextPlayerTurn = (nextPlayerTurn + 1) % state.players.length;
      }

      state.players[nextPlayerTurn].dices = state.players[
        nextPlayerTurn
      ].dices.map((dice) => {
        return { ...dice, locked: false };
      });
      state.playerTurn = nextPlayerTurn;
    },

    selectScore(state, action) {
      if (!state.gameStarted) return;
      if (state.playerTurn !== action.payload.column) return;
      if (state.diceState.isRolling) return;
      const prevScores = state.players[state.playerTurn].scores;
      const newScore: Score[] = prevScores.map((score, index) => {
        if (index === action.payload.row)
          return {
            score: score.score,
            state: "SELECTED",
          };
        if (score.state === "SELECTED") return score;
        return {
          score: 0,
          state: "DEFAULT",
        };
      });
      state.players[state.playerTurn].scores = newScore;
      state.diceState.diceRolled = 0;
      let playerTurn = state.playerTurn;
      if (playerTurn >= state.players.length - 1) playerTurn = 0;
      else playerTurn++;
      state.players[playerTurn].dices = state.players[playerTurn].dices.map(
        (dice) => {
          return { ...dice, locked: false };
        }
      );
      state.playerTurn = playerTurn;
    },
    skipTurn(state) {
      if (state.diceState.diceRolled === 0) return;

      if (state.diceState.isRolling) return;

      const newScore: Score[] = state.players[state.playerTurn].scores.map(
        (score) => {
          if (score.state === "SELECTED") return score;
          return {
            score: 0,
            state: "DEFAULT",
          };
        }
      );

      state.players[state.playerTurn].scores = newScore;

      state.diceState.diceRolled = 0;
      let nextPlayerTurn = (state.playerTurn + 1) % state.players.length;

      while (state.players[nextPlayerTurn].disconnected) {
        nextPlayerTurn = (nextPlayerTurn + 1) % state.players.length;
      }
      state.players[nextPlayerTurn].dices = state.players[
        nextPlayerTurn
      ].dices.map((dice) => {
        return { ...dice, locked: false };
      });

      state.playerTurn = nextPlayerTurn;
    },

    playerLeaveInGame(state, action) {
      const i = state.players.findIndex(
        (player) => player.name === action.payload.name
      );
      state.players[i].disconnected = true;
    },

    hostGame(
      state,
      action: PayloadAction<{ game: Lobby; player: LobbyPlayer }>
    ) {
      state.isMultiplayer = true;
      state.lobby = action.payload.game;
      state.myPlayerName = action.payload.player.name;
    },
    newPlayerJoin(state, action: PayloadAction<LobbyPlayer>) {
      for (let i = 0; i < state.lobby.players.length; i++) {
        if (state.lobby.players[i].name === action.payload.name) {
          return;
        }
      }
      state.lobby.players.push(action.payload);
    },
    setLobby(state, action: PayloadAction<Lobby>) {
      state.lobby = action.payload;
    },
  },
});

export const gameReducer = gameSlice.reducer;
export const gameAction = gameSlice.actions;
