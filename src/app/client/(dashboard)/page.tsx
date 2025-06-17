"use client";
import InputField from "@lib/ui/InputField";
import { useState } from "react";

export default function DashboardPage() {
  const state = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <InputField
        id="example-combobox"
        type="combobox"
        label="Example Combobox"
        options={["test1", "test2", ["test-3", "test3"], "test4", "test5", "test6", "test7"]}
        state={state}
        required
      />
      {/* <TextBox
        id="example-combobox"
        options={["test1", "test2", ["test-3", "test3"], "test4", "test5", "test6", "test7"]}
        value={value}
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
        required
      />
      <TextBox
        id="example-text"
        required
      />
      <TextBox
        id="example-pass"
        type="password"
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        required
      /> */}
    </>
  );
}
