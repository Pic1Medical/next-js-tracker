import { client } from "./client";

export interface GetProductsOptions {
  limit?: number;
  cursor?: string | null;
}

export interface ProductType {
  categoryId: string;
  category: { name: string };
  name: string;
  desc: string;
  partNo: string;
}

export async function getProducts({
  limit,
  cursor,
}: Readonly<GetProductsOptions>): Promise<
  [Array<ProductType>, string | null | undefined]
> {
  const results: Array<ProductType> = [];
  const response = await client.models.Product.list({
    limit,
    nextToken: cursor,
  });
  if (!(!response || !response.data)) {
    let cacheCategory: Record<
      ProductType["categoryId"],
      ProductType["category"]
    > = {};
    for (const res of response.data) {
      let category = cacheCategory[res.categoryId!];
      if (!category) {
        const response = await res.category();
        if (!!response.data) {
          category = {
            ...response.data,
          } as ProductType["category"];
          cacheCategory[res.categoryId!] = category;
        }
      }
      results.push({
        ...res,
        category: {
          name: category.name ?? "",
        },
      } as ProductType);
    }
  }
  return [results, response.nextToken];
}

export interface GetProductsWithStockInfoOptions extends GetProductsOptions {}

export interface StockInfoType {}

export interface ProductWithStockInfoType extends ProductType {
  stock: Array<StockInfoType>;
}

export async function getProductsWithStockInfo({
  ...opts
}: GetProductsWithStockInfoOptions): Promise<
  [Array<ProductWithStockInfoType>, string | null | undefined]
> {
  return (await getProducts({ ...opts })) as unknown as [
    Array<ProductWithStockInfoType>,
    string
  ];
}
