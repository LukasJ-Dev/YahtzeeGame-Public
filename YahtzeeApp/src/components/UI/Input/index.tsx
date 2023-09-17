import { LabelStyle, InputStyle } from "./style";

interface InputProps {
  name?: string;
  label?: string;
  type?: string;
  id?: string;
  min?: string;
  max?: string;
  value?: string | number;
  placeholder?: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  type = "text",
  id,
  min,
  max,
  value,
  placeholder,
  onChange,
}) => {
  return (
    <>
      <LabelStyle htmlFor={name}>{label}</LabelStyle>
      <InputStyle
        type={type}
        id={id}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
