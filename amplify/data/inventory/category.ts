import { a } from "@aws-amplify/backend";

export const Category = a
  .model({
    name: a.string().required(),
  })
  .authorization((allow) => [allow.authenticated()]);
