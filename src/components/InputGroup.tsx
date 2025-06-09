"use client";
import {
  FormEvent,
  FormEventHandler,
  InputHTMLAttributes,
  LabelHTMLAttributes,
} from "react";

export default function InputGroup({
  children,
  list,
  id,
  state,
  label: _labelText,
  ...props
}: {
  id: string;
  label: string;
  list?: (string | [string, string])[];
  state?: [getter: string, setter: ((v: string) => void) | undefined];
  children?: {
    Label: (props: LabelHTMLAttributes<HTMLLabelElement>) => React.ReactNode;
    Input: (props: InputHTMLAttributes<HTMLInputElement>) => React.ReactNode;
  };
} & Omit<InputHTMLAttributes<HTMLInputElement>, "list">) {
  const HasChildren = typeof children === "object";
  const Label = (HasChildren ? children.Label : undefined) ?? "label";
  const Input = (HasChildren ? children.Input : undefined) ?? "input";
  const value = state ? state[0] : "";
  const onInput = (e: FormEvent<HTMLInputElement>) => {
    if (typeof state === "object" && typeof state[1] === "function")
      state[1]((e.target as HTMLInputElement).value);
  };
  return (
    <div className="input-group">
      <Label htmlFor={id} className="input-group-text">
        {_labelText}
      </Label>
      {list && (
        <datalist id={`${id}-datalist`}>
          {list.map((v) => {
            if (typeof v === "string") return <option value={v}>{v}</option>;
            return (
              <option key={v[1]} value={v[0]}>
                {v[1]}
              </option>
            );
          })}
        </datalist>
      )}
      <Input
        {...props}
        id={id}
        className="form-control"
        list={list ? `${id}-datalist` : ""}
        autoComplete="off"
        value={value}
        onChange={onInput}
      />
    </div>
  );
}
