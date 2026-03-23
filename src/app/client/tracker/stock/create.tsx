"use client";
import InputField from "@/src/components/custom/InputField";
import { Field, FieldError, FieldSet } from "@/src/components/ui/field";
import { Button } from "@/src/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/src/components/ui/collapsible";
import { BoxesIcon, PlusSquareIcon } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const createFormSchema = z.object({
  location: z.string().min(1, "Location is required"),
  qty: z.coerce.number().min(1, "Quantity must be at least 1"),
});

type CreateFormSchema = z.infer<typeof createFormSchema>;

export default function CreateStock({
  productId,
}: Readonly<{
  productId: string;
}>) {
  const [busy, setBusy] = useState(false);
  const form = useForm<CreateFormSchema>({
    resolver: zodResolver(createFormSchema),
    mode: "onTouch",
    defaultValues: {
      location: "",
      qty: "1",
    }
  });

  async function onSubmit(fields: CreateFormSchema) {
    setBusy(true);
    await (async()=>{
      const result = await client.models.Stock.create({

      });
    })().catch(handleError).finally(()=>{
      setBusy(false);
    })
  }

  return (
    <section className="container mx-auto px-4 my-4">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet className="px-2 py-2 bg-sidebar text-sidebar-foreground rounded-xl border border-muted">
          <legend className="flex gap-2 items-center bg-sidebar-primary text-sidebar-primary-foreground rounded-lg border border-muted px-2 py-1">
            Create Stock <BoxesIcon size={18} />
          </legend>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                className="w-full justify-start font-bold text-lg h-auto py-2 aria-expanded:rounded-b-none aria-expanded:border-accent"
                variant="outline"
              >
                <PlusSquareIcon size={18} />
                Entry
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-2 border rounded-md rounded-t-none grid rid-cols-1 gap-2">
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <InputField
                      {...field}
                      children="Location"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="qty"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <InputField
                      {...field}
                      children="Quantity"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button type="submit" variant="outline">Create Entry</Button>
            </CollapsibleContent>
          </Collapsible>
        </FieldSet>
      </form>
    </section>
  )
}
