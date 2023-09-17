import styled from "styled-components";

interface Props {
  width: string;
  height: string;
  color: string;
  shadowLevel: number;
}

export const CardStyle = styled.div<Props>`
  background-color: ${(props: Props) => props.color};
  height: ${(props: Props) => props.height};
  width: ${(props: Props) => props.width};
  gap: 5px;

  display: flex;
  flex-direction: column;

  border-radius: 15px;

  ${(props: Props) => {
    switch (props.shadowLevel) {
      case 0:
        return "";
      case 1:
        return "  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;";
      case 2:
        return "box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;";
    }
  }}
`;
