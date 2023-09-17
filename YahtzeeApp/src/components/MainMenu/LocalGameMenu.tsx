import { useState } from "react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { useDispatch } from "react-redux";
import * as S from "./style";
import { gameAction } from "../../store/game/gameSlice";
import { Player } from "../../types";

export default function LocalGameMenu() {
  const [amountOfPlayers, setAmountOfPlayers] = useState(2);

  const dispatch = useDispatch();

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    const p = parseInt(e.currentTarget.value);
    if (p > 0 && p < 10) setAmountOfPlayers(p);
  };

  const StartGame = () => {
    if (amountOfPlayers != 0) {
      const players = createPlayers(amountOfPlayers);
      dispatch(gameAction.startGame(players));
    }
  };

  const createPlayers = (amount: number) => {
    const colors = [
      "#1976d2", //BLUE
      "#e53935", //RED
      "#8e24aa", //PURPLE
      "#311b92", //DEEP PURPLE
      "#1a237e", //INDIGO
      "#0097a7", //CYAN
      "#43a047", //GREEN
      "#f9a825", //ORANGE
      "#cddc39", //LIME
    ];

    const newPlayers: Player[] = new Array(amount);

    for (let i = 0; i < amount; i++) {
      const colorI = Math.floor(Math.random() * colors.length);
      const color = colors[colorI];

      colors.splice(colorI, 1);

      newPlayers[i] = {
        id: i,
        name: "Player " + (i + 1),
        color: color,
        dices: [
          { value: 1, locked: false },
          { value: 2, locked: false },
          { value: 3, locked: false },
          { value: 4, locked: false },
          { value: 5, locked: false },
        ],
        scores: Array(13).fill({ score: 0, state: "DEFAULT" }),
      };
    }
    return newPlayers;
  };

  return (
    <S.MainMenuContainer>
      <h1 style={{ textAlign: "center" }}>Local Game</h1>
      <p style={{ textAlign: "center" }}>How many players do you want?</p>
      <S.PlayerButtonContainer>
        <S.PlayerButton onClick={() => setAmountOfPlayers(2)}>2</S.PlayerButton>
        <S.PlayerButton onClick={() => setAmountOfPlayers(3)}>3</S.PlayerButton>
        <S.PlayerButton onClick={() => setAmountOfPlayers(4)}>4</S.PlayerButton>
      </S.PlayerButtonContainer>
      <Input
        type="number"
        id="AmountOfPlayers"
        name="AmountOfPlayers"
        min="1"
        max="10"
        value={amountOfPlayers}
        onChange={onChange}
        label="Other"
      />
      <Button onClick={StartGame} primary>
        Start Game
      </Button>
    </S.MainMenuContainer>
  );
}
