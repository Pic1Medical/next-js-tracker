import { FormEvent, InputHTMLAttributes, useState } from "react";
import TextBox, { TextBoxProps } from "./TextBox";
import { ComboBoxProps } from "@components/ui/inputs/ComboBox";
import ComboBox from "./ComboBox";

export interface __InputFieldBaseProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password" | "combobox";
  state?: ReturnType<typeof useState<string>>;
}

export type GenericInputFieldProps = Omit<InputHTMLAttributes<unknown>, keyof __InputFieldBaseProps> & __InputFieldBaseProps;

export type InputFieldProps = GenericInputFieldProps & (TextBoxProps | ComboBoxProps);

export default function InputField({ type, ...props }: InputFieldProps) {
  switch (type) {
    case undefined:
    case "text":
      return TextBox(props);
    case "combobox":
      return ComboBox(props);
  }
  return null;
}

interface InputState<Attrs extends InputHTMLAttributes<unknown> = InputHTMLAttributes<unknown>> {
  state?: __InputFieldBaseProps["state"];
  value?: Attrs["value"];
  onInput?: Attrs["onInput"];
  readOnly?: Attrs["readOnly"];
}

export function addInputState({ state, value, onInput, readOnly }: InputState) {
  const result: InputState & { setValue: (s: string) => void } = {
    setValue() {},
  };
  if (typeof state === "string") {
    result.value = state[0];
    result.readOnly = true;
  } else if (typeof state === "object" && Array.isArray(state)) {
    result.value = state[0];
    result.setValue = (v) => {
      state[1](v);
    };
    result.onInput = (e: FormEvent<unknown>) => {
      if (onInput) {
        onInput(e);
        if (e.isDefaultPrevented()) return;
      }
      const target = e.target;
      if (target instanceof HTMLInputElement) result.setValue(target.value);
      else result.setValue((target as HTMLElement).innerText);
    };
  } else result.value = value;
  if (typeof readOnly !== "undefined" && readOnly) result.readOnly = true;
  return result;
}
