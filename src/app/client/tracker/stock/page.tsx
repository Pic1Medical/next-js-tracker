"use client";
import { InfiniteDataTable } from "@/src/components/custom/infinite-table";
import { Button } from "@/src/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import {
  FieldSet,
  Field,
  FieldLabel,
  FieldError,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronsUpDownIcon,
  InfoIcon,
  SearchIcon,
  TextCursorInputIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { columns } from "./_columndef";
import { ProductWithStockInfoType } from "@/src/api/product";
import { client } from "@/src/api/client";

const formSchema = z.object({
  name: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function StockSearchPage() {
  const [filters, setFilters] = useState<Record<string, string | undefined>>({
    name: "",
  });
  const [limit, setLimit] = useState("10");
  const [entries, setEntries] = useState<Array<ProductWithStockInfoType>>([]);
  const [cursor, setCursor] = useState<string | null | undefined>();
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: FormSchema) {
    setThinking(true);
    setLoading(true);
    setCursor(null);
    setEntries([]);
    setFilters(data);
  }

  useEffect(() => {
    if (!thinking) return;
    (async () => {
      await loadMore();
    })()
      .catch((err) => {
        console.error(err);
        setLoading(false);
      })
      .finally(() => {
        setThinking(false);
      });
  }, [filters, thinking]);

  async function loadMore() {
    setLoading(true);
    let filter: object | undefined = undefined;
    for (const fname in filters) {
      const fvalue = filters[fname];
      if (typeof fvalue !== "string") continue;
      filter = {
        [fname]: {
          contains: fvalue,
        },
        and: filter,
      };
    }
    console.log(filter);
    const results = await client.models.Product.list({
      filter,
      limit: Number.parseInt(limit),
      nextToken: cursor,
    });
    const data: Array<ProductWithStockInfoType> = [];
    for (const result of results.data) {
      data.push({
        ...result,
        category: {
          name: "",
        },
        stock: [],
      } as ProductWithStockInfoType);
    }
    setEntries((p) => [...p, ...data]);
    setCursor(results.nextToken);
    setLoading(false);
  }

  return (
    <>
      <section className="container mx-auto px-4">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet
            className="px-2 py-2 bg-sidebar text-sidebar-foreground rounded-xl border border-muted"
            disabled={loading}
          >
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
                      <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
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
      <section className="container mx-auto px-4 mt-2.5">
        <InfiniteDataTable
          columns={columns}
          data={entries}
          hasMore={!!cursor}
          loadMore={loadMore}
          loading={loading}
        />
      </section>
    </>
  );
}
