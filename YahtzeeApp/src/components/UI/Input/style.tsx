import styled from "styled-components";

interface Props {
  type: string;
}

export const LabelStyle = styled.label`
  text-align: center;
`;

export const InputStyle = styled.input`
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  width: fit-content;
  ${(props: Props) =>
    props.type === "number" ? "width: 50px;" : "width: max-content"}
  height: 50px;

  font-size: 1.5em;
  text-align: center;

  border-radius: 4px;
  border: none;
  background-color: lightgray;
`;
