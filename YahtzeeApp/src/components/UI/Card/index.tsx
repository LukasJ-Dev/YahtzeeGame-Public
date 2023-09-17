import React, { ReactNode } from "react";
import { CardStyle } from "./style";

interface CardProps {
  children: ReactNode;
  color?: string;
  height?: string;
  width?: string;
  shadowLevel?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  color = "#f1f1f1f1",
  width = "min-content",
  height = "min-content",
  shadowLevel = 0,
}) => {
  return (
    <CardStyle
      color={color}
      width={width}
      height={height}
      shadowLevel={shadowLevel}
    >
      {children}
    </CardStyle>
  );
};

export default Card;
