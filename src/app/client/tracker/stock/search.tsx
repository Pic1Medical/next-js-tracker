"use client";
import { Schema } from "@/amplify/data/resource";
import InputField from "@/src/components/custom/InputField";
import { Button } from "@/src/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/src/components/ui/collapsible";
import { Field, FieldError, FieldSet } from "@/src/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoxesIcon, SearchIcon, TableIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import z from "zod";
import { handleError } from "@/src/components/custom/toaster";
import { InfiniteDataTable } from "@/src/components/custom/infinite-table";
import { columns } from "./_columndef";
import { client } from "@/src/api/client";

export type EntryType = Omit<Schema["Stock"]["type"], "location"> & {
  location?: Schema["Location"]["type"];
};

const searchFormSchema = z.object({
  location: z.string().optional(),
});

type SearchFormSchema = z.infer<typeof searchFormSchema>;

export default function StockSearch({
  productId,
}: Readonly<{ productId: string }>) {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Array<EntryType>>([]);
  const [cursor, setCursor] = useState<string | undefined | null>();
  const form = useForm<SearchFormSchema>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: "",
    },
  });

  async function processLoad() {
    let locationId = undefined;
    if (form.getValues("location")) {
      const result = await client.models.Location.list({
        filter: {
          name: { eq: form.getValues("location") },
        },
        limit: 1,
      });
      if (!!result.data.length) {
        locationId = result.data[0].id;
      }
    }

    const results = await client.models.Stock.list({
      filter: {
        productId: { eq: productId },
        ...(locationId ? { locationId: { eq: locationId } } : {}),
      },
      nextToken: cursor || undefined,
    });
    if (!!results.data.length) {
      const cachedLocations = new Map<
        string,
        EntryType["location"] | undefined
      >();
      const entries: Array<EntryType> = [];
      for (const result of results.data) {
        let location: EntryType["location"] | undefined = cachedLocations.get(
          result.locationId!
        );
        if (!location) {
          const loc = await result.location();
          if (!!loc.data) location = loc.data;
          cachedLocations.set(result.locationId!, location);
        }
        entries.push({
          ...result,
          location,
        });
      }
      setEntries((p) => [...p, ...entries]);
      setCursor(results.nextToken);
    }
  }

  async function onSubmit(fields: SearchFormSchema) {
    setEntries([]);
    setCursor(undefined);
    await loadMore();
  }

  async function loadMore() {
    setLoading(true);
    await processLoad()
      .catch(handleError)
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <section className="container mx-auto px-4 my-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet className="px-2 py-2 bg-sidebar text-sidebar-foreground rounded-xl border border-muted">
            <legend className="flex gap-2 items-center bg-sidebar-primary text-sidebar-primary-foreground rounded-lg border border-muted px-2 py-1">
              Search Stock <BoxesIcon size={18} />
            </legend>
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  className="w-full justify-start font-bold text-lg h-auto py-2 aria-expanded:rounded-b-none aria-expanded:border-accent"
                  variant="outline"
                >
                  Filters <SearchIcon size={18} />
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
                <div className="grid grid-cols-1">
                  <Button
                    type="submit"
                    variant="outline"
                  >
                    Search <SearchIcon size={18} />
                  </Button>
                </div>
                {form.formState.errors.root && (
                  <FieldError
                    className="px-2 py-2"
                    errors={[form.formState.errors.root]}
                  />
                )}
              </CollapsibleContent>
            </Collapsible>
          </FieldSet>
        </form>
      </section>
      <section className="container mx-auto px-4">
        <InfiniteDataTable
          loading={loading}
          columns={columns}
          data={entries}
          loadMore={loadMore}
          hasMore={!!cursor}
        />
      </section>
    </>
  );
}
