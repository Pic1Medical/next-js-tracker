"use client";
import { client } from "@/src/api/client";
import InputField from "@/src/components/custom/InputField";
import { handleError } from "@/src/components/custom/toaster";
import { Button } from "@/src/components/ui/button";
import { Field, FieldError, FieldSet } from "@/src/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoxIcon, MapPinIcon, TagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const createFormSchema = z.object({
  name: z.string().min(1, "Name field may not be left empty!"),
  desc: z.string().optional(),
  partNo: z.string().optional(),
});

type CreateFormSchema = z.infer<typeof createFormSchema>;

export default function () {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const form = useForm<CreateFormSchema>({
    resolver: zodResolver(createFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      desc: "",
      partNo: "",
    },
  });

  async function onSubmit(data: CreateFormSchema) {
    setBusy(true);
    await (async () => {
      {
        // 1) Check if one location already exists, if so we stop here.
        const existing = await client.models.Location.list({
          filter: { name: { eq: data.name } },
          limit: 1,
        });
        if (!!existing.data.length) {
          console.log(existing);
          form.setError(
            "name",
            {
              type: "validate",
              message: "Location with this name already exists.",
            },
            { shouldFocus: true }
          );
          return;
        }
      }
      {
        // 2) If we don't have an existing category, add one.
        const result = await client.models.Product.create({
          ...data,
        });
        if (!!result.data) {
          router.replace(
            "/client/tracker/product/details?id=" + result.data.id
          );
          return;
        } else {
          const message = "Failed to create new Product, try again...";
          form.setError("root", { message }, { shouldFocus: true });
          throw message;
        }
      }
    })()
      .catch(handleError)
      .finally(() => {
        setBusy(false);
      });
  }

  return (
    <>
      <section className="container mx-auto px-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet
            className="px-2 py-2 bg-sidebar text-sidebar-foreground rounded-xl border border-muted"
            disabled={busy}
          >
            <legend className="flex gap-2 items-center bg-sidebar-primary text-sidebar-primary-foreground rounded-lg border border-muted px-2 py-1">
              Create Product <BoxIcon size={18} />
            </legend>
            <div className="px-4 py-2 border rounded-md grid grid-cols-1 gap-4 pt-3">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="mb-2">
                    <InputField
                      {...field}
                      children="Name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="partNo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="mb-2">
                    <InputField
                      {...field}
                      children="Part #"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="desc"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="mb-2">
                    <InputField
                      {...field}
                      children="Description"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-1">
              <Button
                type="submit"
                variant="outline"
              >
                Submit
              </Button>
            </div>
            {form.formState.errors.root && (
              <FieldError
                className="px-2 py-2"
                errors={[form.formState.errors.root]}
              />
            )}
          </FieldSet>
        </form>
      </section>
    </>
  );
}
