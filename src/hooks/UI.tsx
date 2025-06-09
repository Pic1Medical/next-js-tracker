export const ApplyState = <T extends HTMLElement>(
  state: [string, (s: string) => void]
) => {
  return {
    value: state[0],
    onChange: (e: FormEvent<T>) => {
      state[1]((e.target as unknown as { value: string }).value);
    },
  };
};
