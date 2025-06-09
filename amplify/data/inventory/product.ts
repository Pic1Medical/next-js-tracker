import { a } from "@aws-amplify/backend";

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
