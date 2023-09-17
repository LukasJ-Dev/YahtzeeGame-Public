import "./App.css";
import MainMenu from "./components/MainMenu";
import YahtzeeGame from "./components/YahtzeeGame";
import { useSelector } from "react-redux";
import {
  selectGameStarted,
  selectIsMultiplayer,
} from "./store/game/gameSelector";

import { useEffect } from "react";
import { onError } from "./socket/Socket";

const App = () => {
  const gameStarted = useSelector(selectGameStarted);

  const isMultiplayer = useSelector(selectIsMultiplayer);

  useEffect(() => {
    if (isMultiplayer) {
      onError((message) => {
        alert(message);
        location.reload();
      });
    }
  }, [isMultiplayer]);

  const Menu = gameStarted ? <YahtzeeGame /> : <MainMenu />;

  return <div className="App">{Menu}</div>;
};

export default App;
