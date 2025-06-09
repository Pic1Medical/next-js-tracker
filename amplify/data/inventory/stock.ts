import { a } from "@aws-amplify/backend";

export const Stock = a
  .model({
    productId: a.id(),
    product: a.belongsTo("Product", "productId"),

    locationId: a.id(),
    location: a.belongsTo("Location", "locationId"),

    qty: a.integer().required(),
  })
  .authorization((allow) => [allow.authenticated()]);
