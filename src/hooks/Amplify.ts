import { Schema } from "@/amplify/data/resource";
import { useState } from "react";

export function useEntry<Field extends keyof Schema>() {
  return useState<Schema[Field]["type"] | undefined>(undefined);
}

export function useEntries<Field extends keyof Schema>() {
  return useState<Array<Schema[Field]["type"]>>([]);
}
