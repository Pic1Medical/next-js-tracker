import { a } from "@aws-amplify/backend";

export const Product = a.model({
  id: a.id(),

  categoryId: a.id(),
  category: a.belongsTo("Category", "categoryId"),

  stock: a.hasMany("Stock", "productId"),

  name: a.string().required(),
  desc: a.string(),
});
