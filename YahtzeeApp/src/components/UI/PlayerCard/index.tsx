import { Dice } from "../../../types";
import Card from "../Card";
import DiceContainer from "../DiceContainer";
import { CardTitle } from "./style";

interface PlayerCardProps {
  title: string;
  dices: Dice[];
  diceClick: (id: number) => void;
  diceRoll: boolean;
  color: string;
  highlight: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  title,
  dices,
  diceClick,
  diceRoll,
  color = "blue",
  highlight,
}) => {
  return (
    <Card
      color={color}
      width="340px"
      height="100px"
      shadowLevel={highlight ? 2 : 1}
    >
      <CardTitle>{title}</CardTitle>
      <DiceContainer dices={dices} diceClick={diceClick} diceRoll={diceRoll} />
    </Card>
  );
};

export default PlayerCard;
