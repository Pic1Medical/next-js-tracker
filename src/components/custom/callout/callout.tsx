import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/src/lib/utils";

const calloutVariants = cva(
  "group/callout w-full flex flex-col flex-nowrap border border-l-6 rounded-r px-2 py-2 mt-2",
  {
    variants: {
      variant: {
        info: "",
        error:
          "text-base bg-destructive/20 border-destructive/40  border-l-destructive",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export default function Callout({
  className,
  variant,
  asChild,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof calloutVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      {...props}
      role="group"
      data-slot="callout"
      className={cn(calloutVariants({ variant }), className)}
    />
  );
}
