import React from "react";
import * as S from "./style";
import Card from "../Card";
import { Score } from "../../../types";

interface ScoreCellProps {
  cell: Score;
  onClick: () => void;
}

interface ScoreCardProps {
  rowData: Score[][];
  columnHead: string[];
  rowTitles: string[];
  clickCell: (cell: Score, row: number, column: number) => void;
  highlightHead: string;
}

const ScoreCell: React.FC<ScoreCellProps> = ({ cell, onClick }) => (
  <S.CellStyle state={cell.state} onClick={onClick}>
    {cell.score}
  </S.CellStyle>
);

const ScoreCard: React.FC<ScoreCardProps> = ({
  rowData,
  columnHead,
  rowTitles,
  clickCell,
  highlightHead,
}) => {
  const tableHead = columnHead.map((name) => (
    <S.TableHead key={name} highlighted={highlightHead === name}>
      {name}
    </S.TableHead>
  ));

  const tableRows = rowTitles.map((rowTitle, rowIndex) => (
    <tr className="table-row" key={rowIndex}>
      <S.CellStyle state="SELECTED">{rowTitle}</S.CellStyle>
      {rowData[rowIndex].map((cell, i) => (
        <ScoreCell
          key={i}
          cell={cell}
          onClick={clickCell.bind(this, cell, rowIndex, i)}
        />
      ))}
    </tr>
  ));

  const totalScore = columnHead.map((_head, i) =>
    rowData.reduce((accumulator, currentValue) => {
      if (currentValue[i].state === "SELECTED")
        return accumulator + currentValue[i].score;
      return accumulator;
    }, 0)
  );

  const totalScoreRow = totalScore.map((number, i) => (
    <S.CellStyle key={i}>{number}</S.CellStyle>
  ));
  return (
    <Card>
      <S.ScoreTable>
        <tbody>
          <tr>
            <S.TableHead key="score">Score</S.TableHead>
            {tableHead}
          </tr>
          {tableRows}

          <tr>
            <S.CellStyle key="total">Total</S.CellStyle>
            {totalScoreRow}
          </tr>
        </tbody>
      </S.ScoreTable>
    </Card>
  );
};

export default ScoreCard;
