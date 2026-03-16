import { client } from "./client";

export interface ProductType {
  categoryId: string;
  category: { name: string };
  name: string;
  desc: string;
  partNo: string;
}

export async function getProducts(): Promise<Array<ProductType>> {
  const results: Array<ProductType> = [];
  const response = await client.models.Product.list({});
  if (!(!response || !response.data)) {
    let cacheCategory: Record<
      ProductType["categoryId"],
      ProductType["category"]
    > = {};
    for (const res of response.data) {
      console.log(res.categoryId, res.categoryId! in cacheCategory);
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
  return results;
}

export interface StockInfoType {}

export interface ProductWithStockInfoType extends ProductType {
  stock: Array<StockInfoType>;
}

export async function getProductsWithStockInfo() {
  return (await getProducts()) as unknown as Array<ProductWithStockInfoType>;
}
