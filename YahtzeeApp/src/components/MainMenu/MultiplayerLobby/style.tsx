import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  height: 100vh;
  width: 100vw;
`;

export const Head = styled.header`
  display: flex;

  gap: 50%;
  justify-content: center;
  flex-wrap: wrap;
`;

export const GameCode = styled.p`
  font-size: 2em;
  text-align: center;
`;

export const PlayerContainerCard = styled.div`
  background-color: #f1f1f1f1;
  height: 100%;
  margin: 32px;
  padding: 16px;
  border-radius: 12px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
`;

export const PlayerContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;
