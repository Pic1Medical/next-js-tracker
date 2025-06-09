import { InputHTMLAttributes } from "react";

export default function Input({
  id,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "key">) {
  return <input id={id} key={id} {...props} />;
}
