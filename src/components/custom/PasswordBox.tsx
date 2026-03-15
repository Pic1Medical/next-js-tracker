"use client";
import { twMerge } from "tailwind-merge";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function PasswordBox({
  className,
  outerDiv: { className: divClassName, ...divProps } = {},
  eyeBtn: { className: eyeClassName, ...eyeProps } = {},
  disabled,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  outerDiv?: React.ComponentProps<"div">;
  eyeBtn?: Omit<React.ComponentProps<"button">, "type">;
}) {
  const [type, setType] = useState<"text" | "password">("password");
  const showPassword = !disabled && type == "text";
  function toggle() {
    setType(type == "text" ? "password" : "text");
  }

  return (
    <div
      {...divProps}
      className={twMerge("relative w-full min-w-0 h-fit", divClassName)}
    >
      <Input
        {...props}
        type={type}
        disabled={disabled}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={twMerge(
          "absolute right-0 top-0 text-muted-foreground hover:text-foreground disabled:text-muted-foreground/80",
          eyeClassName
        )}
        aria-pressed={showPassword}
        onClick={toggle}
        disabled={disabled}
      >
        {showPassword ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
        <span className="sr-only">Toggle Password Visibility</span>
      </Button>
    </div>
  );
}
