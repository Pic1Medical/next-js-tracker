"use client";
import { generateClient } from "@aws-amplify/api";
import { Schema } from "@amplify/data/resource";
import useForm from "@lib/ui/Form";
import { useRouter } from "next/navigation";
import makeTable from "@lib/ui/Table";
import { ProductType } from "@amplify/data/inventory/product";
import { useEffect, useState } from "react";

interface SearchFormFields {
  category: string;
  location: string;
  product: string;
  partNo: string;
}

const client = generateClient<Schema>();

const table = makeTable<ProductType>([
  {
    name: "name",
    initialValue: "",
  },
  {
    name: "desc",
    label: "Description",
    initialValue: "",
  },
  {
    name: "partNo",
    label: "Part #",
    initialValue: "---[ N/A ]---",
  },
]);

export default function InventoryPage() {
  const router = useRouter();
  const form = useForm<SearchFormFields>([
    {
      key: "row-1",
      fields: [
        {
          name: "category",
          label: "Category",
          initialValue: "",
          async options(v: string) {
            const result = await client.models.Category.list({
              filter: {
                name: {
                  contains: v,
                },
              },
              limit: 100,
            });
            if (result.data) return result.data.map((e) => [e.id, e.name]);
            throw new Error(`Failed to retrieve categories from AWS Amplify`);
          },
        },
        {
          name: "location",
          label: "Location",
          initialValue: "",
          async options(v: string) {
            const result = await client.models.Location.list({
              filter: {
                name: {
                  contains: v,
                },
              },
              limit: 100,
            });
            if (result.data) return result.data.map((e) => [e.id, e.name]);
            throw new Error(`Failed to retrieve locations from AWS Amplify`);
          },
        },
      ],
    },
    {
      key: "row-2",
      fields: [
        {
          name: "product",
          label: "Product",
          initialValue: "",
          async options(v: string) {
            const result = await client.models.Product.list({
              filter: {
                name: {
                  contains: v,
                },
              },
              limit: 100,
            });
            if (result.data) return result.data.map((e) => [e.id, e.name]);
            throw new Error(`Failed to retrieve products from AWS Amplify`);
          },
        },
        // {
        //   name: "partNo",
        //   label: "Part #",
        //   initialValue: "",
        //   async options(v: string) {
        //     const result = await client.models.Product.list({
        //       filter: {},
        //     });
        //     if (result.data) return result.data.map((e) => [e.id, e.name]);
        //     throw new Error(`Failed to retrieve products via 'part #' from AWS Amplify`);
        //   },
        // },
      ],
    },
  ]);
  const [entries, setEntries] = useState<Array<Schema["Product"]["type"]>>([]);
  useEffect(() => {
    client.models.Product.list().then((r) => {
      if (!r.data || !r.data.length) return;
      setEntries(r.data);
    });
  }, []);

  return (
    <>
      <form.Form
        id="SearchForm"
        onSubmit={async () => {}}
      >
        {[
          {
            type: "submit",
            label: (
              <>
                <i
                  className="bi bi-search"
                  aria-hidden
                >
                  &nbsp;
                </i>
                Search
              </>
            ),
          },
          {
            type: "dropdown",
            label: (
              <>
                <i
                  className="bi bi-plus-square"
                  aria-hidden
                >
                  &nbsp;
                </i>
                New
              </>
            ),
            options: [
              {
                label: (
                  <>
                    <i
                      className="bi bi-box-seam"
                      aria-hidden
                    >
                      &nbsp;
                    </i>
                    Stock
                  </>
                ),
                onClick() {
                  alert("New Stock");
                },
              },
              {
                label: (
                  <>
                    <i
                      className="bi bi-cart"
                      aria-hidden
                    >
                      &nbsp;
                    </i>
                    Product
                  </>
                ),
                onClick() {
                  alert("New Product");
                },
              },
              {
                label: (
                  <>
                    <i
                      className="bi bi-geo-alt"
                      aria-hidden
                    >
                      &nbsp;
                    </i>
                    Location
                  </>
                ),
                async onClick() {
                  await router.push("/client/inventory/create/location");
                },
              },
              {
                label: (
                  <>
                    <i
                      className="bi bi-tags"
                      aria-hidden
                    >
                      &nbsp;
                    </i>
                    Category
                  </>
                ),
                onClick() {
                  alert("New Category");
                },
              },
            ],
          },
        ]}
      </form.Form>
      <hr />
      <table.Table
        className="my-1 mx-2 flex-grow"
        entries={entries as unknown as Array<ProductType>}
      ></table.Table>
    </>
  );
}
