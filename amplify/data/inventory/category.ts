import { a } from "@aws-amplify/backend";

export const Category = a
  .model({
    name: a.string().required(),
    desc: a.string(),
    products: a.hasMany("Product", "categoryId"),
  })
  .authorization((allow) => [allow.authenticated()]);
