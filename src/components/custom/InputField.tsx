import styles from "./InputField.module.css";
import React, { useId } from "react";
import { Label as LabelPrimitive } from "radix-ui";
import { cn } from "@/src/lib/utils";
import { Input } from "../ui/input";

export default function InputField({
  id = useId(),
  type,
  outerDiv: { className: outerDivClassName, ...outerDivProps } = {},
  label: { className: labelClassName, ...labelProps } = {},
  children,
  ...props
}: Omit<React.ComponentProps<"input">, "placeholder"> & {
  outerDiv?: Omit<React.ComponentProps<"div">, "children">;
  label?: Omit<
    React.ComponentProps<typeof LabelPrimitive.Root>,
    "children" | "htmlFor"
  >;
  children: React.ReactNode;
}) {
  return (
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
      <Input
        {...props}
        id={id}
        type={type}
        placeholder=" "
      />
    </div>
  );
}
