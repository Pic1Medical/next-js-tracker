"use client";
import { Schema } from "@/amplify/data/resource";
import { client } from "@/src/api/client";
import InputField from "@/src/components/custom/InputField";
import toast, { handleError } from "@/src/components/custom/toaster";
import { Button } from "@/src/components/ui/button";
import { Field, FieldError, FieldSet } from "@/src/components/ui/field";
import { Spinner } from "@/src/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoxesIcon } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useTrackerContext } from "../../_context";

export type EntryType = Omit<
  Schema["Stock"]["type"],
  "product" | "location"
> & {
  product?: Schema["Product"]["type"];
  location?: Schema["Location"]["type"];
};

const editFormSchema = z.object({
  location: z.string().optional(),
  qty: z.coerce.number().min(1, "Can't have less than 1 stock item."),
});

type EditFormSchema = z.infer<typeof editFormSchema>;

function EditForm({ entry }: Readonly<{ entry: EntryType }>) {
  const router = useRouter();
  const tracker = useTrackerContext();
  useEffect(()=>{
    return tracker?.register(()=>{
      const confirm = window.confirm("Are you sure you wish to delete this Stock item?");
      if(!confirm) return;
      client.models.Stock.delete({ id: entry.id })
        .then((result) => {
          if (!result.data) throw "Failed to delete Stock item, try again...";
          else {
            toast.success("Successfully deleted Stock item.");
            router.back();
          }
        })
      .catch(handleError);
    });
  }, []);


  const [busy, setBusy] = useState(false);
  const form = useForm<EditFormSchema>({
    resolver: zodResolver(editFormSchema),
    mode: "onTouched",
    defaultValues: {
      location: entry.location?.name || "",
      qty: entry.qty,
    },
  });

  async function onSubmit(data: EditFormSchema) {
    setBusy(true);
    await (async () => {
      let locationId = entry.locationId;
      if (data.location && data.location !== entry.location?.name) {
        const result = await client.models.Location.list({
          filter: { name: { eq: data.location } },
          limit: 1,
        });
        if (!!result.data.length) {
          locationId = result.data[0].id;
        } else {
          throw "Could not find a matching location with that name...";
        }
      }
      const result = await client.models.Stock.update({
        id: entry.id,
        locationId,
        qty: data.qty,
      });
      if (!result.data)
        throw "Could not update Stock information, try again...";
      else toast.success("Successfully updated Stock information.");
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
              Stock <BoxesIcon size={18} />
            </legend>
            <div className="px-4 py-2 border rounded-md grid grid-cols-1 gap-4 pt-3">
              <Field className="mb-2">
                <InputField
                  children="Product Name"
                  value={entry.product?.name || "Unknown Product"}
                  readOnly
                />
              </Field>
              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="mb-2">
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
                  <Field className="mb-2">
                    <InputField
                      {...field}
                      children="Quantity"
                      type="number"
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
      const result = await client.models.Stock.get({ id });
      if (!!result.data) {
        const entry = {
          ...result.data,
          product: (await result.data.product()).data,
          location: (await result.data.location()).data,
        } as EntryType;
        console.log(entry);
        setEntry(entry);
      } else throw "No Product Stock with specified ID found, redirecting...";
    })().catch((err) => {
      handleError(err);
      router.replace("/client/tracker/product");
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
