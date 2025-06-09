"use client";
import InputGroup from "@/src/components/InputGroup";
import { generateClient } from "aws-amplify/api";
import { FormEvent, useEffect, useState } from "react";
import type { Schema } from "@amplify/data/resource";
import AddStockModal from "@components/modals/AddStockModal";
import AddLocationModal from "@/src/components/modals/AddLocationModal";

const client = generateClient<Schema>();

export default function InventoryPage() {
  const categoryState = useState("");
  const locationState = useState("");
  const productState = useState("");
  const [busy, setBusy] = useState(false);
  const [stock, setStock] = useState<Array<Schema["Stock"]["type"]>>([]);

  const [locations, setLocations] = useState<Array<string>>([]);

  const [categories, setCategories] = useState<Array<string>>([]);

  useEffect(() => {
    const sub1 = client.models.Location.observeQuery().subscribe((v) =>
      setLocations(v.items.flatMap((v) => [v.name, v.id]))
    );

    const sub2 = client.models.Category.observeQuery().subscribe((v) =>
      setCategories(v.items.flatMap((v) => [v.name, v.id]))
    );

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    const filters: Record<string, unknown> = {};
    if (locationState[0].length > 0) filters["locationId"] = locationState[0];
    if (categoryState[0].length > 0) filters["categoryId"] = categoryState[0];
    client.models.Stock.list({
      filter: filters,
    })
      .then((v) => {
        setStock(v.data);
      })
      .catch(console.error)
      .finally(() => setBusy(false));
  };

  function StockItem({ stock }: { stock: Schema["Stock"]["type"] }) {
    const [product, setProduct] = useState<
      Schema["Product"]["type"] | undefined
    >(undefined);
    const [location, setLocation] = useState<
      Schema["Location"]["type"] | undefined
    >(undefined);
    useEffect(() => {
      stock
        .product()
        .then((e) => setProduct(e.data ?? undefined))
        .catch(console.error);
      stock
        .location()
        .then((e) => setLocation(e.data ?? undefined))
        .catch(console.error);
    }, []);
    // const product = await stock.product();
    // const location = await stock.location();
    if (!product || !location)
      return (
        <tr key={stock.id}>
          <td colSpan={4} className="placeholder"></td>
        </tr>
      );
    return (
      <tr key={stock.id}>
        <td></td>
        <td>{product.name}</td>
        <td>{location.name}</td>
        <td>{stock.qty}</td>
      </tr>
    );
  }

  return (
    <>
      <form className="mx-2 my-1" onSubmit={onSubmit}>
        <fieldset className="container-fluid" disabled={busy}>
          <legend>Inventory Search</legend>
          <div className="row">
            <div className="col-md mb-2">
              <InputGroup
                id="Category"
                label="Category"
                list={categories}
                state={categoryState}
              />
            </div>
            <div className="col-md mb-2">
              <InputGroup
                id="Locations"
                label="Locations"
                list={locations}
                state={locationState}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md mb-2">
              <InputGroup
                id="product-name"
                label="Product"
                state={productState}
              />
            </div>
            <div className="col-md">
              <div className="btn-group w-100">
                <button type="submit" className="btn btn-outline-primary">
                  <i className="bi bi-search" aria-hidden>
                    &nbsp;
                  </i>
                  Search
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add-stock-modal"
                >
                  <i className="bi bi-plus-square" aria-hidden>
                    &nbsp;
                  </i>
                  Add&nbsp;Stock
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#add-location-modal"
                >
                  <i className="bi bi-cloud-plus" aria-hidden>
                    &nbsp;
                  </i>
                  Add&nbsp;Location
                </button>
                <button type="button" className="btn btn-outline-primary">
                  <i className="bi bi-bookmark-plus" aria-hidden>
                    &nbsp;
                  </i>
                  Add&nbsp;Category
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
      <table className="table table-rounded table-striped table-hover table-sm mx-2 my-1 w-auto">
        <thead className="table-primary">
          <tr>
            <th>Actions</th>
            <th>Name</th>
            <th>Location</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody className="table-secondary">
          {stock.map((s) => (
            <StockItem stock={s} />
          ))}
          {!stock.length && (
            <tr>
              <td colSpan={4}>No results...</td>
            </tr>
          )}
        </tbody>
      </table>
      <AddLocationModal id="add-location-modal" />
      <AddStockModal id="add-stock-modal" />
    </>
  );
}
