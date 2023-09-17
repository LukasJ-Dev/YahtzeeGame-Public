import styled from "styled-components";

export const ScoreTable = styled.table<{ state?: string }>`
  table-layout: fixed;
  width: 500px;
  max-width: 90vw;
  min-width: 300px;
  min-height: 600px;

  border-collapse: separate;
  border-spacing: 0;
`;

export const CellStyle = styled.td<{ state?: string }>`
  height: 50px;
  border: 1px solid gray;
  text-align: center;

  min-height: 50px;
  max-height: 100px;

  ${(props: { state?: string }) => {
    switch (props.state) {
      case "SELECTED":
        return "background-color: #b3b3b3;";
      case "FLASHING":
        return "animation: 1s alternate 0s blink-cell infinite;";
    }
  }}
  @keyframes blink-cell {
    0% {
      background-color: rgba(0, 0, 0, 0);
    }
    100% {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }
`;

export const TableHead = styled.th<{ highlighted?: boolean }>`
  height: 50px;
  min-height: 50px;
  max-height: 100px;

  border-top: none;
  border: 1px solid gray;

  ${(props: { highlighted?: boolean }) =>
    props.highlighted && "background-color: #b3b3b3"};

  &:first-child {
    border-radius: 15px 0 0 0;

    border-collapse: separate;
  }

  &:last-child {
    border-radius: 0 15px 0 0;

    border-collapse: separate;
  }

  &:only-child {
    border-radius: 15px 15px 0 0;

    border-collapse: separate;
  }
`;
