import { a } from "@aws-amplify/backend";

export const Location = a
  .model({
    name: a.string().required(),
    desc: a.string(),
    stock: a.hasMany("Stock", "locationId"),
  })
  .authorization((allow) => [allow.authenticated()]);
