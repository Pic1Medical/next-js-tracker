import { Schema } from "@/amplify/data/resource";
import { FormEvent, useState } from "react";

export function useEntry<Field extends keyof Schema>() {
  return useState<Schema[Field]["type"] | undefined>(undefined);
}

export function useEntries<Field extends keyof Schema>() {
  return useState<Array<Schema[Field]["type"]>>([]);
}

export function Datalist<Model extends keyof Schema>({
  id,
  entries,
  keyField,
  labelField,
}: {
  id: string;
  entries: Array<Schema[Model]["type"]>;
  keyField: keyof Schema[Model]["type"];
  labelField: keyof Schema[Model]["type"];
}) {
  return (
    <datalist {...{ id }}>
      {entries.map((entry) => (
        <option
          key={entry[keyField] as string | number}
          value={entry[keyField] as string | number}
        >
          {entry[labelField] as string | number}
        </option>
      ))}
    </datalist>
  );
}
