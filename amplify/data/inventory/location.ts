import { a } from "@aws-amplify/backend";

export const Location = a
  .model({
    name: a.string().required(),
    desc: a.string(),
  })
  .authorization((allow) => [allow.authenticated()]);
