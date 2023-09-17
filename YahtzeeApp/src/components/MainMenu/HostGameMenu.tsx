import React, { useState } from "react";
import * as S from "./style";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { host } from "../../socket/Socket";

export default function HostGameMenu() {
  const [username, setUsername] = useState("");

  const hostGame = () => {
    host(username);
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
      <Button primary onClick={() => hostGame()}>
        Host Game
      </Button>
    </S.MainMenuContainer>
  );
}
