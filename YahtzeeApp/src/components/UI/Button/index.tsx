import React, { ReactNode } from "react";
import { ButtonStyle } from "./style";

interface ButtonType {
  children: ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const Button: React.FC<ButtonType> = ({
  primary = false,
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <ButtonStyle primary={primary} onClick={onClick} disabled={disabled}>
      {children}
    </ButtonStyle>
  );
};

export default Button;
