import { a } from "@aws-amplify/backend";

export const Category = a
  .model({
    name: a.string().required(),
    products: a.hasMany("Stock", "categoryId"),
  })
  .authorization((allow) => [allow.authenticated()]);
