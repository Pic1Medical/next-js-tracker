import React, { FormEvent, RefObject, useRef } from "react";
import ComboBox from "./ComboBox";
import { BaseProperties } from "./TextBox";
import styles from "./TextBox.module.scss";

export type Properties = Omit<BaseProperties, "list"> & {
  type?: "text";
} & (
    | {
        list?: never;
        options?: Array<string | [value: string, label?: string]>;
      }
    | {
        list?: BaseProperties["list"];
        options?: never;
      }
  );

export default function _TextBoxForText({ id, options, value: _value, onInput: _onInput, ...props }: Properties) {
  let onBlurTargetRef: RefObject<HTMLDivElement> | undefined = undefined;
  let value: string | undefined;
  let onInput: ((e: FormEvent<HTMLInputElement>) => void) | undefined = undefined;
  if (typeof _value == "object") {
    value = _value[0];
    onInput = (e: FormEvent<HTMLInputElement>) => {
      if (_onInput) _onInput(e);
      if (!e.isDefaultPrevented()) _value[1]((e.target as HTMLInputElement).value);
    };
  } else value = _value;

  let TextBox: React.ReactNode;
  if (!options) {
    TextBox = (
      <input
        id={id}
        placeholder=" "
        autoComplete="off"
        {...props}
      />
    );
  } else {
    onBlurTargetRef = useRef<HTMLDivElement>(null);
    TextBox = (
      <ComboBox
        asChild
        onBlurTargetRef={onBlurTargetRef!}
        id={id}
        options={options}
        {...props}
      />
    );
  }
  return (
    <div
      className={styles["tbox-wrapper"]}
      role="group"
      ref={onBlurTargetRef ? onBlurTargetRef : undefined}
    >
      <label htmlFor={id}>Test</label>
      {TextBox}
    </div>
  );
}
