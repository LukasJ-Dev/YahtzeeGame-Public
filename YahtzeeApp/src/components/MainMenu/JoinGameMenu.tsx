import React, { useState } from "react";
import * as S from "./style";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { join } from "../../socket/Socket";

export default function JoinGameMenu() {
  const [username, setUsername] = useState("");

  const [gameCode, setGameCode] = useState("");

  const joinGame = () => {
    join(username, gameCode);
  };

  return (
    <S.MainMenuContainer>
      <Input
        type="text"
        id="username"
        name="username"
        placeholder="Name"
        value={username}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setUsername(e.currentTarget.value)
        }
      />

      <Input
        type="text"
        id="gamecode"
        name="gamecode"
        placeholder="Game Code"
        value={gameCode}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          setGameCode(e.currentTarget.value)
        }
      />
      <Button primary onClick={() => joinGame()}>
        Join Game
      </Button>
    </S.MainMenuContainer>
  );
}
