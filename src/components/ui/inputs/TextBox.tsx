import { InputHTMLAttributes } from "react";
import _TextBoxForText, { Properties as _TextProperties } from "./TextBox.text";
import _TextBoxForPass, { Properties as _PassProperties } from "./TextBox.pass";

export interface BaseProperties extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id" | "placeholder" | "role" | "value"> {
  id: string;
  type?: "text" | "email" | "password";
  value?: string | [string, (v: string) => void];
}

export type Properties = BaseProperties & (_TextProperties | _PassProperties);

export default function TextBox(props: Properties) {
  switch (props.type) {
    case undefined:
    case "text":
      return _TextBoxForText(props);
    case "password":
      return _TextBoxForPass(props);
  }
  return null;
}
