import { cn } from "@/src/lib/utils";
import { Slot } from "radix-ui";

export default function CalloutTitle({
  className,
  asChild,
  ...props
}: React.ComponentProps<"span"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      {...props}
      className={cn("text-lg", className)}
    />
  );
}
