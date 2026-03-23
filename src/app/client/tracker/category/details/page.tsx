"use client";
import { Schema } from "@/amplify/data/resource";
import { client } from "@/src/api/client";
import InputField from "@/src/components/custom/InputField";
import toast, { handleError } from "@/src/components/custom/toaster";
import { Button } from "@/src/components/ui/button";
import { Field, FieldError, FieldSet } from "@/src/components/ui/field";
import { Spinner } from "@/src/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPinIcon, TagIcon } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export type EntryType = Schema["Category"]["type"];

const editFormSchema = z.object({
  name: z.string().min(1, "Name field may not be left empty!"),
  desc: z.string().optional(),
});

type EditFormSchema = z.infer<typeof editFormSchema>;

function EditForm({ entry }: Readonly<{ entry: EntryType }>) {
  const [busy, setBusy] = useState(false);
  const form = useForm<EditFormSchema>({
    resolver: zodResolver(editFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: entry.name,
      desc: entry.desc ?? "",
    },
  });

  async function onSubmit(data: EditFormSchema) {
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
        // 2) Update the existing category with the new data
        const result = await client.models.Category.update({
          id: entry.id,
          ...data,
        });
        if (!!result.data) {
          toast.success("Category updated successfully!");
        } else {
          const message = "Failed to update Category, try again...";
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
              Category <TagIcon size={18} />
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

export default function () {
  const router = useRouter();
  const params = useSearchParams();
  if (!params.has("id")) return redirect("/client/tracker/category");
  const id = params.get("id")!;
  const [entry, setEntry] = useState<EntryType | undefined>();

  useEffect(() => {
    (async () => {
      const result = await client.models.Category.get({ id });
      if (!!result.data) {
        setEntry(result.data);
      } else throw "No Category with specified ID found, redirecting...";
    })().catch((err) => {
      handleError(err);
      router.replace("/client/tracker/category");
    });
  }, []);

  if (entry == undefined)
    return (
      <section
        role="status"
        className="container mx-auto px-4 flex flex-col items-center gap-2"
      >
        <Spinner />
        <span>Loading...</span>
      </section>
    );

  return <EditForm entry={entry} />;
}
