import { useDispatch, useSelector } from "react-redux";
import { getRandomDices } from "../utils/random";
import { gameAction } from "../store/game/gameSlice";
import {
  selectIsMultiplayer,
  selectIsRolling,
} from "../store/game/gameSelector";
import * as Socket from "../socket/Socket";

export function useRollDice(): () => void {
  const dispatch = useDispatch();
  const isRolling = useSelector(selectIsRolling);
  const isMultiplayer = useSelector(selectIsMultiplayer);

  return () => {
    if (isRolling) return;
    if (isMultiplayer) {
      Socket.rollDice();
    } else {
      dispatch(gameAction.startRollDice());
      const interval = setInterval(() => {
        dispatch(gameAction.rollDiceAnimation(getRandomDices()));
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        dispatch(gameAction.finishRollDice(getRandomDices()));
      }, 3000);
    }
  };
}
