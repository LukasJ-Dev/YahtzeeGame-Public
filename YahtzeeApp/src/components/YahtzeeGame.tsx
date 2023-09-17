import PlayerCardList from "./UI/PlayerCardList";
import YahtzeeScoreCard from "./YahtzeeScoreCard";
import styled from "styled-components";
import RollDiceButton from "./RollDiceButton";
import { useDispatch, useSelector } from "react-redux";
import Button from "./UI/Button";
import {
  selectDiceRolls,
  selectIsMultiplayer,
  selectPlayerTurn,
} from "../store/game/gameSelector";
import { gameAction } from "../store/game/gameSlice";
import { useEffect } from "react";

import * as Socket from "../socket/Socket";
import { getRandomDices } from "../utils/random";
import { Player } from "../types";

const GameContainer = styled.div`
  display: flex;
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default function YahtzeeGame() {
  const diceRolls = useSelector(selectDiceRolls);
  const playerName = useSelector(selectPlayerTurn);

  const dispatch = useDispatch();

  const isMultiplayer = useSelector(selectIsMultiplayer);

  useEffect(() => {
    if (isMultiplayer) {
      const diceLockEvent = Socket.onDiceLocked(
        (playerId: number, diceIndex: number) => {
          dispatch(gameAction.lockDice({ playerId, diceIndex }));
        }
      );

      const diceRollEvent = Socket.onDiceRolled((dices) => {
        dispatch(gameAction.startRollDice());
        const interval = setInterval(() => {
          dispatch(gameAction.rollDiceAnimation(getRandomDices()));
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          dispatch(gameAction.finishRollDice(dices));
        }, 3000);
      });

      const scoreSelectedEvent = Socket.onScoreSelected((updatedScore) => {
        dispatch(gameAction.setScoreTable(updatedScore));
      });

      const playerSkippedEvent = Socket.onPlayerSkipped(() => {
        dispatch(gameAction.skipTurn());
      });

      const playerLeftEvent = Socket.onPlayerLeftInGame((player: Player) => {
        dispatch(gameAction.playerLeaveInGame(player));
      });
      return () => {
        Socket.removeEvents([
          diceLockEvent,
          diceRollEvent,
          scoreSelectedEvent,
          playerSkippedEvent,
          playerLeftEvent,
        ]);
      };
    }
  }, [isMultiplayer, dispatch]);

  const skipTurn = () => {
    if (isMultiplayer) {
      Socket.skipTurn();
    } else {
      dispatch(gameAction.skipTurn());
    }
  };

  return (
    <GameContainer>
      <PlayerCardList />
      <div>
        <RollDiceButton />
        <div className="game-info">
          <h1 style={{ textAlign: "center" }}>It's {playerName} turn</h1>
          <h2 style={{ textAlign: "center" }}>{3 - diceRolls} rolls left</h2>

          <Button onClick={() => skipTurn()}>Next</Button>
        </div>
      </div>
      <YahtzeeScoreCard />
    </GameContainer>
  );
}
