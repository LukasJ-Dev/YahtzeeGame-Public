import * as S from "./style";
import Card from "../../UI/Card";
import { CardTitle } from "../../UI/PlayerCard/style";
import Button from "../../UI/Button";
import { useSelector } from "react-redux";
import { start } from "../../../socket/Socket";
import {
  selectHostPlayerName,
  selectLobby,
  selectMyPlayerName,
} from "../../../store/game/gameSelector";
import { useMultiplayerLobby } from "../../../hooks/useMultiplayerLobby";

interface PlayerCardProps {
  name: string;
  color: string;
  isHost: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  color,
  isHost = false,
}) => {
  return (
    <Card color={color} width="340px" height="50px" shadowLevel={1}>
      <CardTitle>
        {name} {isHost && <strong> | HOST 👑</strong>}
      </CardTitle>
    </Card>
  );
};

export default function MultiplayerLobby() {
  const lobbyState = useSelector(selectLobby);

  const playerHostName = useSelector(selectHostPlayerName);
  const myPlayerName = useSelector(selectMyPlayerName);

  const startGame = () => {
    start(lobbyState.gameCode);
  };

  useMultiplayerLobby();

  const playerCards = lobbyState.players.map((player) => (
    <PlayerCard
      key={player.name + player.color}
      color={player.color}
      name={player.name}
      isHost={player.isHost}
    />
  ));
  return (
    <S.Container>
      <S.Head>
        <S.GameCode>
          The game code is <strong>{lobbyState.gameCode}</strong>
        </S.GameCode>
        {playerHostName === myPlayerName && (
          <Button primary onClick={() => startGame()}>
            Start Game
          </Button>
        )}
      </S.Head>
      <S.PlayerContainerCard>
        <S.PlayerContainer>{playerCards}</S.PlayerContainer>
      </S.PlayerContainerCard>
    </S.Container>
  );
}
