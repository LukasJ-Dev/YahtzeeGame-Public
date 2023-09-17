import ScoreCard from "./UI/ScoreCard";
import {
  Scoring,
  NumberScoring,
  ThreeOfKind,
  FourOfKind,
  FullHouse,
  SmallStraight,
  LargeStraight,
  Yahtzee,
  Chance,
} from "../Scoring";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  selectDices,
  selectIsMultiplayer,
  selectPlayerName,
  selectPlayers,
} from "../store/game/gameSelector";
import { Score } from "../types";
import { gameAction } from "../store/game/gameSlice";

import * as Socket from "../socket/Socket";

const scoringRulesTable: Map<string, Scoring> = new Map([
  ["Ones", new NumberScoring(1)],
  ["Twos", new NumberScoring(2)],
  ["Threes", new NumberScoring(3)],
  ["Fours", new NumberScoring(4)],
  ["Fives", new NumberScoring(5)],
  ["Sixes", new NumberScoring(6)],
  ["Three of Kind", new ThreeOfKind()],
  ["Four of Kind", new FourOfKind()],
  ["Full House", new FullHouse()],
  ["Small Straight", new SmallStraight()],
  ["Large Straight", new LargeStraight()],
  ["Yahtzee", new Yahtzee()],
  ["Chance", new Chance()],
]);

function YahtzeeScoreCard() {
  const dispatch = useDispatch();

  const players = useSelector(selectPlayers);
  const dices = useSelector(selectDices);
  const playerName = useSelector(selectPlayerName);

  const isMultiplayer = useSelector(selectIsMultiplayer);

  const rowTitles = Array.from(scoringRulesTable.keys());

  const handleCellClick = (cell: Score, row: number, column: number) => {
    if (cell.state !== "FLASHING") return;
    if (isMultiplayer) {
      Socket.selectScore(row);
    } else {
      dispatch(gameAction.selectScore({ row, column }));
    }
  };

  useEffect(() => {
    const newScore: Score[] = [];
    for (const key of scoringRulesTable.keys()) {
      const diceValues = dices.map((dices) => dices.value);
      newScore.push({
        score: scoringRulesTable.get(key)?.getScores(diceValues) || 0,
        state: "DEFAULT",
      });
    }
    dispatch(gameAction.updateScore(newScore));
  }, [dices, dispatch]);

  const columnHead = players.map((player) => player.name);

  const rowData = players[0].scores.map((_score, index) => {
    return players.map((player) => player.scores[index]);
  });

  return (
    <ScoreCard
      rowTitles={rowTitles}
      columnHead={columnHead}
      rowData={rowData}
      clickCell={handleCellClick}
      highlightHead={playerName}
    />
  );
}

export default YahtzeeScoreCard;
