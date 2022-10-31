import { ChangeEventHandler } from "react";
import style from "../styles/Input.module.css";

interface IInput {
  type: string;
  name: string;
  holdStr: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string | number | undefined;
  length?: { min: number; max: number } | undefined;
}

export default function InputComponent(props: IInput) {
  let minLength,
    maxLength: number | undefined = undefined;

  if (props.length !== undefined) {
    minLength = props.length?.min;
    maxLength = props.length?.max;
  }
  return (
    <input
      type={props.type}
      name={props.name}
      className={style.input_component}
      placeholder={props.holdStr}
      onChange={props.onChange}
      value={props.value}
      minLength={minLength}
      maxLength={maxLength}
    />
  );
}
