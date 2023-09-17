import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./game/gameSlice";

const store = configureStore({
  reducer: gameReducer,
});

export default store;
