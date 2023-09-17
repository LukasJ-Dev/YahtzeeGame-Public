import Button from "./UI/Button";
import { useRollDice } from "../hooks/useRollDice";
import { useSelector } from "react-redux";
import { selectIsMyTurn } from "../store/game/gameSelector";

function RollDiceButton() {
  const RollDice = useRollDice();

  const isMyTurn = useSelector(selectIsMyTurn);

  return (
    <Button primary onClick={RollDice} disabled={!isMyTurn}>
      Roll Dice
    </Button>
  );
}

export default RollDiceButton;
