import React from "react";
import DiceItem from "../DiceItem";
import { ContainerStyle } from "./style";
import { Dice } from "../../../types";

interface DiceContainerProps {
  dices: Dice[];
  diceClick: (id: number) => void;
  diceRoll: boolean;
}

const DiceContainer: React.FC<DiceContainerProps> = ({
  dices,
  diceClick,
  diceRoll,
}) => {
  if (dices.length > 6) {
    return <p>TO MANY DICES</p>;
  }

  return (
    <ContainerStyle>
      {dices.map((dice, index) => (
        <DiceItem
          key={index}
          value={dice.value}
          highlighted={dice.locked}
          diceRoll={diceRoll}
          onClick={diceClick.bind(this, index)}
        />
      ))}
    </ContainerStyle>
  );
};

export default DiceContainer;
