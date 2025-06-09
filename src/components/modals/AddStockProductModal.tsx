import { FormEvent, useEffect, useState } from "react";
import Modal from "../Modal";
import { Schema } from "@amplify/data/resource";
import { useEntries } from "@/src/hooks/Amplify";
import { generateClient } from "aws-amplify/api";
import { ApplyState } from "@/src/hooks/UI";

const client = generateClient<Schema>();

export default function AddStockProductModal({ id }: { id: string }) {
  const [createProduct, setCreateProduct] = useState(false);
  const [createStock, setCreateStock] = useState(false);
  const nameState = useState("");
  const qtyState = useState(0);
  const descState = useState("");
  const categoryState = useState("");
  const locationState = useState("");
  const onSubmit = async () => {
    let productId: string | undefined = undefined;
    const product = await client.models.Product.list({
      filter: {
        name: { eq: nameState[0] },
      },
    });
    if (product.errors) {
      console.log(product);
      throw new Error(
        "Failed to query existing products to locate a potentially existing version."
      );
    }
    if (!product.data || product.data.length === 0) {
      if (!createProduct) return;
      const result = await client.models.Product.create({
        categoryId: categoryState[0],
        name: nameState[0],
        desc: descState[0].length ? descState[0] : undefined,
      });
      if (result.errors || !result.data) {
        console.log(result);
        throw new Error("Failed to create new Product in the database.");
      }
      productId = result.data.id;
    } else productId = product.data[0].id;

    if (!createStock) return;

    const result = await client.models.Stock.create({
      productId,
      locationId: locationState[0],
      qty: qtyState[0],
    });
    if (result.errors || !result.data) {
      console.log(result);
      throw new Error("Failed to create new Stock in the database!");
    }
  };

  const [categories, setCategories] = useEntries<"Category">();
  const [locations, setLocations] = useEntries<"Location">();

  useEffect(() => {
    const sub1 = client.models.Location.observeQuery().subscribe((v) =>
      setLocations(v.items)
    );

    const sub2 = client.models.Category.observeQuery().subscribe((v) =>
      setCategories(v.items)
    );

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, []);

  return (
    <Modal title="Add Product" {...{ id, onSubmit }} autoDismiss>
      <div className="row">
        <div className="col-sm mb-2">
          <div className="form-group">
            <label htmlFor={`${id}-field-name`} className="form-label required">
              Name
            </label>
            <input
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
      <hr />
      <div className="row">
        <div className="col mb-2">
          <div className="d-flex w-100 align-items-center justify-content-center">
            <div className="input-group w-auto">
              <label
                className="btn btn-outline-primary user-select-none"
                htmlFor={`${id}-create-product`}
              >
                New Product?
              </label>
              <div className="input-group-text">
                <input
                  id={`${id}-create-product`}
                  className="form-check-input mt-0"
                  type="checkbox"
                  value={String(createProduct)}
                  onChange={(e) => {
                    console.log(e);
                    setCreateProduct(
                      Boolean((e.target as HTMLInputElement).checked)
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col mb-2">
          <div className="d-flex w-100 align-items-center justify-content-center">
            <div className="input-group w-auto">
              <label
                className="btn btn-outline-primary user-select-none"
                htmlFor={`${id}-create-stock`}
              >
                New Stock?
              </label>
              <div className="input-group-text">
                <input
                  id={`${id}-create-stock`}
                  className="form-check-input mt-0"
                  type="checkbox"
                  value={String(createStock)}
                  onChange={(e) => {
                    console.log(e);
                    setCreateStock(
                      Boolean((e.target as HTMLInputElement).checked)
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <fieldset disabled={!createProduct}>
        <div className="row mb-2">
          <div className="col">
            <div className="form-group">
              <label className="form-label" htmlFor={`${id}-field-desc`}>
                Description
              </label>
              <textarea
                className="form-control"
                rows={3}
                maxLength={512}
                style={{ resize: "none" }}
                {...ApplyState(descState)}
              ></textarea>
            </div>
          </div>
          <div className="col-sm mb-2">
            <div className="form-group">
              <label
                htmlFor={`${id}-field-category`}
                className="form-label required"
              >
                Category
              </label>
              <input
                id={`${id}-field-category`}
                type="text"
                list={`${id}-field-category-datalist`}
                autoComplete="off"
                className="form-control"
                required
                maxLength={128}
                {...ApplyState(categoryState)}
              />
              <datalist id={`${id}-field-category-datalist`}>
                {categories &&
                  categories.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </datalist>
            </div>
          </div>
        </div>
      </fieldset>
      <hr />
      <fieldset disabled={!createStock}>
        <div className="row">
          <div className="col-sm mb-2">
            <div className="form-group">
              <label
                htmlFor={`${id}-field-location`}
                className="form-label required"
              >
                Location
              </label>
              <input
                id={`${id}-field-location`}
                type="text"
                list={`${id}-field-location-datalist`}
                autoComplete="off"
                className="form-control"
                required
                maxLength={128}
                {...ApplyState(locationState)}
              />
              <datalist id={`${id}-field-location-datalist`}>
                {locations &&
                  locations.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </datalist>
            </div>
          </div>
          <div className="col-sm">
            <div className="form-group">
              <label
                htmlFor={`${id}-field-qty`}
                className="form-label required"
              >
                Quantity
              </label>
              <input
                id={`${id}-field-qty`}
                type="number"
                className="form-control"
                required
                min={1}
                step={1}
                {...ApplyState(qtyState)}
              />
            </div>
          </div>
        </div>
      </fieldset>
    </Modal>
  );
}
