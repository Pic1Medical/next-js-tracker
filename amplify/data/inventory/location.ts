import { a } from "@aws-amplify/backend";

export interface LocationType {
  name: string;
  desc: string | undefined;
  stock?: Array<object>;
}

export const Location = a
  .model({
    name: a.string().required(),
    desc: a.string(),
    stock: a.hasMany("Stock", "locationId"),
  })
  .authorization((allow) => [allow.authenticated()]);
