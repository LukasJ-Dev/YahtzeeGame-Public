import { useEffect, useState } from "react";
import Button from "../UI/Button";
import * as S from "./style";
import LocalGameMenu from "./LocalGameMenu";

import JoinGameMenu from "./JoinGameMenu";
import HostGameMenu from "./HostGameMenu";
import MultiplayerLobby from "./MultiplayerLobby";
import {
  connectToSocket,
  onJoinLobby,
  onJoinLobbyError,
  removeEvents,
} from "../../socket/Socket";
import { useDispatch } from "react-redux";
import { gameAction } from "../../store/game/gameSlice";
import { Lobby, LobbyPlayer } from "../../types";

const MainMenu = () => {
  const [menuState, setMenuState] = useState("main");

  const dispatch = useDispatch();

  useEffect(() => {
    if (menuState === "join" || menuState === "host") {
      connectToSocket();
      const joinLobbyEvent = onJoinLobby((game: Lobby, player: LobbyPlayer) => {
        dispatch(gameAction.hostGame({ game, player }));
        setMenuState("lobby");
      });
      const joinErrorEvent = onJoinLobbyError((message) => {
        alert(message);
      });
      return () => {
        removeEvents([joinLobbyEvent, joinErrorEvent]);
      };
    }
  }, [dispatch, menuState]);

  let menu: JSX.Element = <p>Something went wrong</p>;

  switch (menuState) {
    case "main":
      menu = (
        <S.MainMenuContainer>
          <Button onClick={() => setMenuState("local")}>Local Game</Button>
          <Button onClick={() => setMenuState("join")}>Join Online Game</Button>
          <Button onClick={() => setMenuState("host")}>Host Online Game</Button>
        </S.MainMenuContainer>
      );
      break;

    case "local":
      menu = <LocalGameMenu />;
      break;
    case "join":
      menu = <JoinGameMenu />;
      break;
    case "host":
      menu = <HostGameMenu />;
      break;
    case "lobby":
      menu = <MultiplayerLobby />;
      break;
  }

  return menu;
};

export default MainMenu;
