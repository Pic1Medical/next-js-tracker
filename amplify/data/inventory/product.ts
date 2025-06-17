import { a } from "@aws-amplify/backend";

export interface ProductType {
  name: string;
  desc: string | undefined;
  partNo: string | undefined;
  categoryId: string | undefined;
  category: Array<object>;
  stock: Array<object>;
}

export const Product = a
  .model({
    categoryId: a.id(),
    category: a.belongsTo("Category", "categoryId"),

    stock: a.hasMany("Stock", "productId"),

    name: a.string().required(),
    partNo: a.string(),
    desc: a.string(),
  })
  .authorization((allow) => [allow.authenticated()]);
