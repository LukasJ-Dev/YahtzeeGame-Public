import styled from "styled-components";

interface Props {
  primary: boolean;
}

export const ButtonStyle = styled.button<Props>`
  width: 250px;
  height: 50px;
  background-color: ${(props: Props) =>
    props.primary ? "rgb(60, 73, 255);" : "gray"};
  color: white;
  font-size: 1.5em;

  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  border-radius: 15px;
  border: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
