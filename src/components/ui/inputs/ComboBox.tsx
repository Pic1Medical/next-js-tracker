import { InputHTMLAttributes, KeyboardEvent, MouseEvent, RefObject, useEffect, useRef, useState } from "react";
import styles from "./ComboBox.module.scss";

export type ComboBoxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id" | "placeholder"> & {
  id: string;
  options?: Array<string | [value: string, label?: string]>;
} & (
    | {
        asChild?: never;
        onBlurTargetRef?: never;
      }
    | {
        asChild: true;
        onBlurTargetRef: RefObject<HTMLElement>;
      }
  );

function UniqueOptions(options: ComboBoxProps["options"]): Exclude<ComboBoxProps["options"], undefined> {
  const _options: ComboBoxProps["options"] = [];
  if (options) {
    const mapped: Record<string, string | undefined> = {};
    for (const item of options) {
      if (typeof item === "string") mapped[item] = undefined;
      else mapped[item[0]] = item[1];
    }
    for (const value in mapped) _options.push([value, mapped[value]]);
  }
  return _options;
}

export default function ComboBox({ id, className, asChild, value, options: _options, onBlurTargetRef, ...props }: ComboBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showOptions, setShowOptions] = useState(false);
  const options = UniqueOptions(_options);

  const onFocus = () => {
    setSelectedIndex(-1);
    setShowOptions(true);
  };

  const onFocusOut = (e: FocusEvent) => {
    const focusedElm = e.relatedTarget as HTMLElement;
    console.log(focusedElm, comboboxRef.current);
    if (focusedElm && comboboxRef.current) {
      if (focusedElm == comboboxRef.current) return;
      if (comboboxRef.current.contains(focusedElm)) return;
    }
    setShowOptions(false);
  };

  useEffect(() => {
    if (!asChild || !onBlurTargetRef || !onBlurTargetRef.current) return;
    const element = onBlurTargetRef.current;
    element.addEventListener("focusout", onFocusOut);
    return () => {
      element.removeEventListener("focusout", onFocusOut);
    };
  }, [asChild, onBlurTargetRef]);

  useEffect(() => {
    if (selectedIndex == -1) return;
    if (selectedIndex >= options.length) return;
    comboboxRef.current?.children[selectedIndex].scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedIndex, comboboxRef]);

  const onKeyDownListBox = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key == "ArrowUp") {
      e.preventDefault();
      const index = Math.max(0, selectedIndex - 1);
      setSelectedIndex(index);
    } else if (e.key == "ArrowDown") {
      e.preventDefault();
      const index = Math.min(options.length - 1, selectedIndex + 1);
      setSelectedIndex(index);
    } else if (e.key == "Tab") {
      if (e.shiftKey) return;
      const index = selectedIndex + 1;
      if (index >= options.length) return;
      e.preventDefault();
      setSelectedIndex(index);
    }
  };

  const onClickedOption = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!target.hasAttribute("data-value")) return;
    const value = target.getAttribute("data-value")!;
    if (inputRef.current) inputRef.current.value = value;
  };
  const templated = (
    <>
      <input
        id={id}
        ref={inputRef}
        type="text"
        role="combobox"
        className={`${styles["combobox-input"]} ${className}`}
        autoComplete="off"
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        aria-expanded={showOptions}
        aria-activedescendant=""
        value={value}
        placeholder=" "
        onFocus={onFocus}
        {...props}
      />
      <i className={styles["combobox-caret"]}></i>
      <div
        id={`${id}-listbox-wrapper`}
        className={styles["combobox-wrapper"]}
        aria-hidden={!showOptions}
        data-orientation="below"
      >
        <div
          ref={comboboxRef}
          id={`${id}-listbox`}
          role="listbox"
          className={styles["combobox-listbox"]}
          onKeyDown={onKeyDownListBox}
          tabIndex={0}
        >
          {options.map((opt, idx) => (
            <div
              key={opt[0]}
              className={`${styles["combobox-option"]} ${selectedIndex == idx ? styles["active"] : undefined}`}
              role="option"
              data-value={opt[0]}
              aria-selected={value === opt[0]}
              onClick={onClickedOption}
            >
              {opt[1] ?? opt[0]}
            </div>
          ))}
        </div>
      </div>
    </>
  );
  return asChild ? templated : <div className={styles["combobox-control"]}>{templated}</div>;
}
