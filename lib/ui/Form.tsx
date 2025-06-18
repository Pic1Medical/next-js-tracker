"use client";
import { FormEvent, FormEventHandler, FormHTMLAttributes, MouseEventHandler, useEffect, useRef, useState } from "react";
import InputField, { InputFieldProps } from "./InputField";

export type BreakPoint = "sm" | "md" | "lg" | undefined;
export type ColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | undefined;

type FormFieldProps<T extends object> = Omit<InputFieldProps, "name" | "type"> & {
  name: keyof T;
};

export interface FormFieldCol<T extends object, K extends keyof T = keyof T, V = T[K]> {
  name: K;
  initialValue: V | (() => V);
  label?: string;
  options?: (value: V, signal: AbortSignal) => Promise<Array<[value: string, label?: string]>>;
  validator?: (value: V, options: Array<[value: string, label?: string]> | undefined, signal: AbortSignal) => Promise<string[]>;
  columnSize?: ColumnSize;
  fieldProps?: Partial<Omit<FormFieldProps<T>, "name">>;
}

export interface FormFieldRow<T extends object> {
  key?: string | number;
  breakPoint?: BreakPoint;
  fields: Array<FormFieldCol<T>>;
}

export interface FormState<T extends object> {
  state?: undefined | "submitting" | "resetting";
  data: Partial<T>;
}

export interface Properties<T extends object> extends Omit<FormHTMLAttributes<HTMLFormElement>, "children" | "id" | "onSubmit"> {
  id: string;
  disabled?: boolean;
  onSubmit: (data: T) => Promise<void>;
  children?: Array<
    {
      key?: string | number;
      type?: "button" | "submit" | "reset" | "dropdown";
      label: React.ReactNode;
      disabled?: boolean;
    } & (
      | { type: "submit" | "reset" }
      | {
          type?: "button";
          onClick: MouseEventHandler<HTMLButtonElement>;
        }
      | {
          type: "dropdown";
          options: Array<{
            key?: string | number;
            label: React.ReactNode;
            disabled?: boolean;
            onClick: MouseEventHandler<HTMLButtonElement>;
          }>;
        }
    )
  >;
}

export default function useForm<T extends object>(fields: Array<FormFieldRow<T>>) {
  function Form({ id: formId, children, disabled: _disabled, onSubmit, ...props }: Properties<T>) {
    const [disabled, setDisabled] = useState(_disabled);
    useEffect(() => {
      setDisabled(_disabled);
    }, [_disabled]);

    function Row({ breakPoint = "md", fields }: FormFieldRow<T>) {
      function Col<K extends keyof T = keyof T, V = T[K]>({ columnSize, initialValue, label, options: optionsFn, validator: validatorFn, className, ...props }: FormFieldCol<T, K, V> & { className?: string }) {
        function Field({ name, ...props }: FormFieldProps<T>) {
          const [value, setValue] = useState<V>(initialValue);
          const [errors, setErrors] = useState<string[]>(undefined);

          if (typeof optionsFn === "function") {
            const [options, setOptions] = useState<Awaited<ReturnType<typeof optionsFn>>>();
            useEffect(() => {
              const controller = new AbortController();
              optionsFn(value, controller.signal)
                .then((r) => {
                  if (controller.signal.aborted) return;
                  setOptions(r);
                })
                .catch(console.error);
              return () => {
                controller.abort();
              };
            }, [value]);
            useEffect(() => {
              if (typeof validatorFn !== "function") return;
              if (typeof value !== "string") return;
              if (typeof options !== "object" || !Array.isArray(options)) return;
              const controller = new AbortController();
              validatorFn(value, options, controller.signal)
                .then((err) => {
                  console.log(err);
                  if (controller.signal.aborted) return;
                  if (!err.length) err = undefined;
                  setErrors(err);
                })
                .catch(console.error);
              return () => {
                controller.abort();
              };
            }, [value, options, validatorFn]);

            return (
              <>
                <InputField
                  id={props.id}
                  name={String(name)}
                  type="combobox"
                  options={options}
                  label={props.label}
                  value={String(value)}
                  onChange={(e) => {
                    setValue((e.target as HTMLInputElement).value as V);
                  }}
                  {...props}
                />
                {errors && (
                  <ul>
                    {errors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                )}
              </>
            );
          }

          return (
            <>
              <InputField
                id={props.id}
                name={String(name)}
                label={props.label}
                value={String(value)}
                onChange={(e) => {
                  if (typeof value === "string") setValue((e.target as HTMLInputElement).value as V);
                  else if (typeof value === "number") setValue((e.target as HTMLInputElement).valueAsNumber as V);
                  else if (typeof value === "object" && value instanceof Date) setValue((e.target as HTMLInputElement).valueAsDate as V);
                }}
              />
              {errors && (
                <ul>
                  {errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              )}
            </>
          );
        }

        return (
          <div className={`col${breakPoint ? `-${breakPoint}` : ""}${columnSize ? `-${columnSize}` : ""} ${className ?? ""}`}>
            <Field
              id={`${formId}-${String(props.name)}`}
              name={props.name}
              label={label ?? String(props.name)}
              {...props.fieldProps}
            />
          </div>
        );
      }

      return (
        <div className="row mb-2">
          {fields.map((field, idx) => (
            <Col
              key={String(field.name)}
              className={idx + 1 == fields.length ? "" : "mb-2"}
              {...field}
            />
          ))}
        </div>
      );
    }

    const onSubmitCb = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    };

    return (
      <form
        id={formId}
        className="my-1"
        onSubmit={onSubmitCb}
        {...props}
      >
        <fieldset
          className="container-fluid"
          disabled={disabled}
        >
          {fields &&
            fields.map(({ key, ...fields }, idx) => (
              <Row
                key={key ?? idx}
                {...fields}
              />
            ))}
          <div className="row">
            <div className="col">
              <div
                className="btn-group w-100 btn-group-sm"
                role="group"
              >
                {children.map(({ label, ...props }, idx) => {
                  switch (props.type) {
                    case undefined:
                    case "button":
                    case "submit":
                    case "reset":
                      return (
                        <button
                          {...props}
                          key={props.key ?? idx}
                          className="btn btn-outline-primary"
                          children={label}
                        />
                      );
                    case "dropdown":
                      return (
                        <div
                          className="btn-group dropdown"
                          role="group"
                          key={props.key ?? idx}
                        >
                          <button
                            type="button"
                            className="btn btn-outline-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            children={label}
                          />
                          <ul className="dropdown-menu">
                            {props.options.map(({ label, key: _key, ...opt }, key) => (
                              <li key={_key ?? key}>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  {...opt}
                                  children={label}
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
  return {
    Form,
  };
}
