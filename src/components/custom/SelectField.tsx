"use client";
import styles from "./InputField.module.css";
import React, { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/src/lib/utils";
import { isCancelError } from "aws-amplify/api";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "../ui/combobox";
import { Spinner } from "../ui/spinner";

type OptionType = [key: string, value: string];
type ArrOptionType = Array<OptionType>;

export default function SelectField({
  id = useId(),
  type,
  outerDiv: { className: outerDivClassName, ...outerDivProps } = {},
  label: { className: labelClassName, ...labelProps } = {},
  children,
  options: optionsFn,
  value,
  onChange,
  ...props
}: Omit<
  ComboboxPrimitive.Input.Props & {
    showTrigger?: boolean;
    showClear?: boolean;
  },
  "placeholder"
> & {
  outerDiv?: Omit<React.ComponentProps<"div">, "children">;
  label?: Omit<
    React.ComponentProps<typeof LabelPrimitive.Root>,
    "children" | "htmlFor"
  >;
  children: React.ReactNode;
  options: (cvalue: string, signal: AbortSignal) => Promise<ArrOptionType>;
}) {
  const refInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ArrOptionType>([]);
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    const abortController = new AbortController();
    setOptions([]);
    setLoading(true);

    (async () => {
      const res = await optionsFn(String(value), abortController.signal);
      setOptions(res);
    })()
      .catch((err) => {
        if (isCancelError(err)) return;
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort(
        "Input field has been modified, results of this promise will likely be discarded.",
      );
    };
  }, [value]);

  function onChangeMiddleware(ev: ChangeEvent<HTMLInputElement>) {
    setDisplayValue(ev.target.value);
    const input = refInput.current;
    if (input) {
      input.setAttribute("value", "");
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function onValueChange(
    value: string | null,
    ev: ComboboxPrimitive.Root.ChangeEventDetails,
  ) {
    if (ev.reason == "item-press") {
      console.log(refInput.current);
      const input = refInput.current;
      if (input) {
        input.setAttribute("value", value as string);
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      setDisplayValue((ev.event.target as HTMLElement).innerText);
    }
  }

  return (
    <>
      <div
        {...outerDivProps}
        className={cn("relative w-full", styles.container, outerDivClassName)}
      >
        <LabelPrimitive.Root
          {...labelProps}
          htmlFor={id}
          className={cn(
            "absolute top-[50%] left-0 right-0 translate-y-[-50%] px-3 pointer-events-none select-none transition-all",
            labelClassName,
          )}
          children={children}
        />
        <Combobox
          items={options}
          onValueChange={onValueChange}
        >
          <ComboboxInput
            {...props}
            id={id}
            type={type}
            value={displayValue}
            onChange={onChangeMiddleware}
            placeholder=" "
          />
          <ComboboxContent>
            <ComboboxEmpty className="items-center gap-1.5">
              {loading ? (
                <>
                  <Spinner />
                  <span>Loading...</span>
                </>
              ) : (
                <>Nothing found...</>
              )}
            </ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem
                  key={item[0]}
                  value={item[0]}
                >
                  {item[1]}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <input
        ref={refInput}
        className="hidden"
        onChange={onChange}
        aria-hidden
      />
    </>
  );
}
