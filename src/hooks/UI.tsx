import { FormEvent } from "react";

export const ApplyState = <T extends HTMLElement, V extends string | number>(
  state: [V, (s: V) => void]
) => {
  return {
    value: state[0],
    onChange: (e: FormEvent<T>) => {
      if ((e.target as unknown as { type?: string }).type === "number") {
        (state[1] as (s: number) => void)(
          (e.target as unknown as { valueAsNumber: number }).valueAsNumber
        );
      } else {
        (state[1] as (s: string) => void)(
          (e.target as unknown as { value: string }).value
        );
      }
    },
  };
};
