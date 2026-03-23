"use client";
import { Schema } from "@/amplify/data/resource";
import { client } from "@/src/api/client";
import { InfiniteDataTable } from "@/src/components/custom/infinite-table";
import InputField from "@/src/components/custom/InputField";
import { Button } from "@/src/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { Field, FieldError, FieldSet } from "@/src/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/src/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BoxIcon,
  ChevronsUpDownIcon,
  InfoIcon,
  SearchIcon,
  TagIcon,
  TextCursorInputIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { columns } from "./_columndef";
import { handleError } from "@/src/components/custom/toaster";

export type EntryType = Omit<Schema["Product"]["type"], "category"> & {
  category?: Schema["Category"]["type"];
};

interface SearchParams {
  loading: boolean;
  limit: string;
  setLimit: (value: string) => void;
}

const searchFormSchema = z.object({
  name: z.string().optional(),
  partNo: z.string().optional(),
  category: z.string().optional(),
});
type SearchFormSchema = z.infer<typeof searchFormSchema>;

function SearchSection({
  loading,
  limit,
  setLimit,
  onSubmit,
}: Readonly<SearchParams> & {
  onSubmit: (params: SearchFormSchema) => Promise<void>;
}) {
  const form = useForm<SearchFormSchema>({
    resolver: zodResolver(searchFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      partNo: "",
      category: "",
    },
  });

  return (
    <section className="container mx-auto px-4">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet
          className="px-2 py-2 bg-sidebar text-sidebar-foreground rounded-xl border border-muted"
          disabled={loading}
        >
          <legend className="flex gap-2 items-center bg-sidebar-primary text-sidebar-primary-foreground rounded-lg border border-muted px-2 py-1">
            Search Product <BoxIcon size={18} />
          </legend>
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <Button
                className="w-full justify-start font-bold text-lg h-auto py-2 aria-expanded:rounded-b-none aria-expanded:border-accent"
                variant="ghost"
              >
                <TextCursorInputIcon className="mr-1 size-auto" />
                <span>Search Fields</span>
                <ChevronsUpDownIcon className="ml-auto size-auto" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-2 border rounded-md rounded-t-none grid grid-cols-1 md:grid-cols-3 gap-4">
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
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="mb-2">
                    <InputField
                      {...field}
                      children="Category"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
          <div className="pb-2 flex items-center justify-end">
            <div className="mr-auto flex">
              <Tooltip>
                <Select
                  value={limit}
                  onValueChange={setLimit}
                >
                  <SelectTrigger aria-label='# of entries per "Show More"'>
                    <SelectValue placeholder="???" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="80">80</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-hidden
                  >
                    <InfoIcon size="18" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent aria-hidden>
                  # of entries per "Show More"
                </TooltipContent>
              </Tooltip>
            </div>
            <Button variant="outline">
              <SearchIcon />
              <span>Search</span>
            </Button>
          </div>
        </FieldSet>
      </form>
    </section>
  );
}

export default function () {
  const [limit, setLimit] = useState("20");
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<Array<EntryType>>([]);
  const [filters, setFilters] = useState<SearchFormSchema>({});
  const [cursor, setCursor] = useState<string | undefined | null>(undefined);
  const [needsMore, setNeedsMore] = useState(0);
  const [nonce, setNonce] = useState(0);

  async function onSubmit(values: SearchFormSchema) {
    setEntries([]);
    setFilters(values);
    setCursor(undefined);
  }

  useEffect(() => {
    loadMore();
  }, [filters]);

  useEffect(() => {
    if (needsMore > 0) loadMore();
  }, [needsMore, nonce]);

  async function loadMore() {
    setLoading(true);
    await processLoadMore()
      .catch(handleError)
      .finally(() => {
        setLoading(false);
      });
  }

  async function processLoadMore() {
    const count = needsMore ? needsMore : Number(limit) ?? 20;
    let filter: object | undefined = undefined;
    for (const fname in filters) {
      const fvalue = filters[fname as keyof SearchFormSchema];
      const mode = fname.endsWith("Id") ? "eq" : "contains";
      if (typeof fvalue !== "string" || !fvalue.length) continue;
      filter = {
        [fname]: {
          [mode]: fvalue,
        },
        and: filter,
      };
    }
    const result = await client.models.Product.list({
      filter,
      limit: count,
      nextToken: cursor,
    });
    if (!!result.data) {
      let missingCategory = false;
      const cachedCategories = new Map<string, EntryType["category"]>();
      const entries: Array<EntryType> = [];
      for (const entry of result.data) {
        let e = { ...entry, category: {} } as unknown as EntryType;
        const category = e.categoryId;
        if (!!category) {
          if (!cachedCategories.has(category)) {
            const categoryResult = await entry.category();
            if (!!categoryResult.data)
              cachedCategories.set(category, categoryResult.data);
            else {
              missingCategory = true;
              console.warn(
                `Missing category for id ${category} on product ${e.id}`
              ); // Log missing category
            }
          }
          e.category = cachedCategories.get(category);
        }
        entries.push(e);
      }
      setEntries((p) => [...p, ...entries]);
      setCursor(result.nextToken);
      if (entries.length < count && !!result.nextToken) {
        const needed = count - entries.length;
        console.log(
          `Requested ${count} entries, but only ${entries.length} returned. Will load ${needed} more to compensate for missing categories.`
        );
        setNeedsMore(needed);
        setNonce((p) => p + 1);
      }
    } else throw new Error("Unexpected error occurred, try again.");
  }

  return (
    <>
      <SearchSection {...{ limit, setLimit, onSubmit, loading }} />
      <section className="container mx-auto px-4 py-2">
        <InfiniteDataTable
          {...{ loading, loadMore, columns, data: entries, hasMore: !!cursor }}
        />
      </section>
    </>
  );
}
