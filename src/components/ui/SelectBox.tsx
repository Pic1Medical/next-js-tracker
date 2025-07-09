import React, { FormEvent, useEffect, useRef, useState } from "react";

export interface Props {
  id: string;
  state: [string, (v: string | ((v: string) => string)) => void];
  options?: Array<[value: string, label?: string] | string>;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function SelectBox({
  id,
  state,
  options,
  disabled,
  children,
}: Props) {
  const [showOptions, setShowOptions] = useState(false);
  const [value, setValue] = useState("");
  const [filtered, setFiltered] = useState<
    Exclude<Props["options"], undefined>
  >(options ?? []);

  function DropdownItem({ value }: { value: string | [string, string?] }) {
    const key = Array.isArray(value) ? value[0] : value;
    const label = Array.isArray(value) ? value[1] ?? value[0] : value;
    return (
      <li>
        <a
          className="dropdown-item"
          href="#"
          onClick={() => {
            setValue(label);
            state[1](key);
          }}
        >
          {label}
        </a>
      </li>
    );
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.type !== "focusin") return;
    setShowOptions(true);
  };
  const onBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.type !== "focusout") return;
    if (e.target.contains(e.relatedTarget)) return;
    setShowOptions(false);
  };

  const onInput = (e: FormEvent<HTMLInputElement>) => {
    const v = (e.target as HTMLInputElement).value;
    if (options) {
      let found = false;
      for (const option of options) {
        if (Array.isArray(option)) {
          if ((option[1] ?? option[0]) === v) {
            state[1](option[0]);
            found = true;
          }
        } else {
          if (option === v) {
            state[1](option);
            found = true;
          }
        }
      }
      if (!found) console.warn(`Failed to find a match for the select box?!`);
    } else state[1](v);
    setValue(v);
  };
  useEffect(() => {
    const opts = (options ?? []).filter((opt) => {
      if (Array.isArray(opt)) {
        if ((opt[1] ?? opt[0]).indexOf(value) != -1) return true;
      } else if (opt.indexOf(value) != -1) return true;
      return false;
    });
    setFiltered(opts);
  }, [value, options]);
  return (
    <div
      className="input-group"
      onFocus={() => {}}
      onBlur={onBlur}
    >
      <label
        htmlFor={id}
        className="input-group-text"
      >
        {children}
      </label>
      <ul
        className="select-dropdown"
        aria-hidden={!showOptions}
      >
        {filtered &&
          filtered.map((opt) => (
            <DropdownItem
              key={Array.isArray(opt) ? opt[0] : opt}
              value={opt}
            />
          ))}
        {(!filtered || !filtered.length) && (
          <li>
            <a
              className="dropdown-item"
              href="#"
              aria-disabled
            >
              No results...
            </a>
          </li>
        )}
      </ul>
      <input
        id={id}
        className="form-control"
        autoComplete="off"
        aria-autocomplete="none"
        value={value}
        onInput={onInput}
        onFocus={onFocus}
        disabled={disabled}
      />
      <button
        className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        onClick={() => setShowOptions(!showOptions)}
      />
    </div>
  );
}
