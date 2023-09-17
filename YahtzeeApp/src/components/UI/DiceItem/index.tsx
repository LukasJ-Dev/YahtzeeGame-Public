import React from "react";
import { DiceStyle } from "./style";

interface DiceItemProps {
  value: number;
  highlighted: boolean;
  onClick: () => void;
  diceRoll: boolean;
}

const diceNames = [
  null,
  "DiceOne",
  "DiceTwo",
  "DiceThree",
  "DiceFour",
  "DiceFive",
  "DiceSix",
];

const DiceItem: React.FC<DiceItemProps> = ({
  value,
  highlighted,
  onClick,
  diceRoll,
}) => {
  const canRollDice = !highlighted && diceRoll;

  const dicePath: string | undefined = `Dices/${diceNames[value]}.png`;
  return (
    <DiceStyle
      src={dicePath}
      highlighted={highlighted}
      onClick={onClick}
      rollingDice={canRollDice}
    />
  );
};

export default DiceItem;
