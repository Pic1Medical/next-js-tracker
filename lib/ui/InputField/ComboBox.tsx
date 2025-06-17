import { KeyboardEvent, MouseEvent, RefObject, useEffect, useRef, useState } from "react";
import { addInputState, GenericInputFieldProps } from ".";
import styles from "./ComboBox.module.scss";
import tboxStyles from "./TextBox.module.scss";

export interface ComboBoxProps extends GenericInputFieldProps {
  type?: "combobox";
  labeled?: BooleanIsh;
  asChild?: BooleanIsh;
  options?: Array<string | [value: string, label?: string]>;
}

export interface __ComboBoxImplProps extends Omit<ComboBoxProps, "asChild"> {
  refContainer: RefObject<HTMLElement>;
}

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

export function __ComboBoxImpl({ id, state: _state, value, onInput, readOnly, className, options: _options, refContainer, labeled, ...props }: Omit<__ComboBoxImplProps, "type">) {
  const [text, setText] = useState("");

  const { setValue, ...state } = addInputState({
    state: _state,
    value,
    onInput,
    readOnly,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showOptions, setShowOptions] = useState(false);
  const options = UniqueOptions(_options);

  const onFocus = () => {
    if (state.readOnly) return;
    setSelectedIndex(-1);
    setShowOptions(true);
  };

  const onFocusOut = (e: FocusEvent) => {
    const focusedElm = e.relatedTarget as HTMLElement;
    if (focusedElm && comboboxRef.current) {
      if (focusedElm == comboboxRef.current) return;
      if (comboboxRef.current.contains(focusedElm)) return;
    }
    setShowOptions(false);
  };

  useEffect(() => {
    if (!refContainer.current) return;
    const element = refContainer.current;
    element.addEventListener("focusout", onFocusOut);
    return () => {
      element.removeEventListener("focusout", onFocusOut);
    };
  }, [refContainer]);

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
    } else if (e.key == "Enter" || e.key == " ") {
      const target = e.target as HTMLDivElement;
      const child = target.children.item(selectedIndex);
      if (child) (child as HTMLElement).click();
    }
  };

  const onClickedOption = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!target.hasAttribute("data-value")) return;
    const value = target.getAttribute("data-value")!;
    setValue(value);
    setText(target.textContent);
  };

  return (
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
        placeholder=" "
        onFocus={onFocus}
        value={text}
        onInput={(e) => setText((e.target as HTMLInputElement).value)}
        {...props}
      />
      <i className={styles["combobox-caret"]}></i>
      <div
        id={`${id}-listbox-wrapper`}
        className={styles["combobox-wrapper"]}
        aria-hidden={!showOptions}
        data-hide-labels={!labeled}
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
}

export default function ComboBox({ type: _type = "combobox", ...props }: ComboBoxProps) {
  const refContainer = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={refContainer}
      className={tboxStyles["tbox-wrapper"]}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <__ComboBoxImpl
        refContainer={refContainer}
        {...props}
      />
    </div>
  );
}
