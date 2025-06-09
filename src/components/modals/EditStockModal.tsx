"use client";
import { FormEvent, useEffect, useState } from "react";
import Modal from "../Modal";
import { Schema } from "@amplify/data/resource";
import { useEntries } from "@/src/hooks/Amplify";
import { generateClient } from "aws-amplify/api";
import Input from "../Input";
import { ApplyState } from "@/src/hooks/UI";

const client = generateClient<Schema>();

export default function EditStockModal({
  id,
  stockId,
}: {
  id: string;
  stockId: string | undefined;
}) {
  const [loading, setLoading] = useState(true);
  const nameState = useState("");
  const descState = useState("");
  const categoryState = useState("");
  const locationState = useState("");
  const qtyState = useState(0);

  useEffect(() => {
    console.log(stockId);
    if (!stockId) return;
    setLoading(true);
    new Promise(async () => {
      const result = await client.models.Stock.get({
        id: stockId,
      });
      if (result.errors || !result.data) {
        console.log(result);
        throw new Error(
          "Failed to retrieve existing stock information from database."
        );
      }
      const stock = result.data;
      const result1 = await stock.product();
      if (result1.errors || !result1.data) {
        console.log(result1);
        throw new Error(
          "Failed to retrieve existing product information from database."
        );
      }
      const product = result1.data;
      const result2 = await product.category();
      if (result2.errors || !result2.data) {
        console.log(result2);
        throw new Error(
          "Failed to retrieve existing category information from database."
        );
      }
      const category = result2.data;
      const result3 = await product.category();
      if (result3.errors || !result3.data) {
        console.log(result3);
        throw new Error(
          "Failed to retrieve existing location information from database."
        );
      }
      const location = result3.data;
      nameState[1](product.name);
      descState[1](product.desc ?? "");
      categoryState[1](category.name);
      locationState[1](location.name);
      qtyState[1](stock.qty);
    })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [stockId]);

  const onSubmit = async () => {};

  return (
    <Modal title="Edit Stock" {...{ id, onSubmit }}>
      {!loading && (
        <div className="row">
          <div className="col mb-2">
            <div className="form-group">
              <label
                htmlFor={`${id}-field-name`}
                className="form-label required"
              >
                Name
              </label>
              <Input
                id={`${id}-field-name`}
                type="text"
                className="form-control"
                required
                maxLength={128}
                {...ApplyState(nameState)}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
