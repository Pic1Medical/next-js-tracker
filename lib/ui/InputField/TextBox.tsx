import { addInputState, GenericInputFieldProps } from ".";
import styles from "./TextBox.module.scss";

export interface TextBoxProps extends GenericInputFieldProps {
  type?: "text";
}

export default function TextBox({ type = "text", className, id, label, state: _state, value, readOnly, onInput, ...props }: TextBoxProps) {
  const { setValue, ...state } = addInputState({
    state: _state,
    value,
    onInput,
    readOnly,
  });
  return (
    <div className={`${styles["tbox-wrapper"]} ${className ?? ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder=" "
        {...props}
        {...state}
      />
    </div>
  );
}
