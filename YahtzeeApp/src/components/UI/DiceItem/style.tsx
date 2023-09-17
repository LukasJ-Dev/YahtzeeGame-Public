import styled from "styled-components";

interface Props {
  rollingDice: boolean;
  highlighted: boolean;
}

export const DiceStyle = styled.img`
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 5px;

  ${({ rollingDice }: Props) =>
    rollingDice &&
    `
    animation: 3s linear 0s roll-dice-animation;
  `}

  ${({ highlighted }: Props) =>
    highlighted &&
    `
    animation: 0.25s linear 0s float-dice;
    box-shadow: 2px 5px 20px 2px #000000; 
    opacity: 0.85;
  `}

@keyframes float-dice {
    0% {
      box-shadow: 0px 0px 0px 0px #000000;
    }
    100% {
      box-shadow: 2px 5px 20px 2px #000000;
    }
  }

  @keyframes roll-dice-animation {
    10% {
      box-shadow: 2px 5px 20px 2px #000000;
    }

    20% {
      transform: rotate(50deg);

      box-shadow: 2px 5px 20px 2px #000000;
    }

    80% {
      transform: rotate(3600deg);

      box-shadow: 2px 5px 20px 2px #000000;
    }

    90% {
      transform: rotate(3800deg);

      box-shadow: 2px 5px 20px 2px #000000;
    }

    100% {
      transform: rotate(3850deg);
    }
  }
`;
