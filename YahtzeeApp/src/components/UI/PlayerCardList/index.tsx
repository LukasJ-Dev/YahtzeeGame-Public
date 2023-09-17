import PlayerCard from "../PlayerCard";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsMultiplayer,
  selectIsRolling,
  selectPlayerTurn,
  selectPlayers,
} from "../../../store/game/gameSelector";
import { Dice } from "../../../types";
import { gameAction } from "../../../store/game/gameSlice";
import * as Socket from "../../../socket/Socket";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const PlayerCardList = () => {
  const dispatch = useDispatch();

  const players = useSelector(selectPlayers);
  const isRolling = useSelector(selectIsRolling);
  const playerTurn = useSelector(selectPlayerTurn);

  const isMultiplayer = useSelector(selectIsMultiplayer);

  const lockDice = (playerId: number, diceIndex: number) => {
    if (isMultiplayer) {
      Socket.lockDice(diceIndex);
    } else {
      dispatch(
        gameAction.lockDice({ playerId: playerId, diceIndex: diceIndex })
      );
    }
  };

  return (
    <ListContainer>
      {players.map((player) => {
        const dices: Dice[] = player.dices.map((dice) => {
          return {
            value: dice.value,
            locked: dice.locked,
          };
        });

        return (
          <PlayerCard
            title={`${player.name} ${
              player.disconnected ? "(DISCONNECTED)" : ""
            }`}
            key={player.id}
            color={player.color}
            highlight={player.id === playerTurn}
            dices={dices}
            diceClick={lockDice.bind(this, player.id)}
            diceRoll={playerTurn == player.id && isRolling}
          />
        );
      })}
    </ListContainer>
  );
};

export default PlayerCardList;
