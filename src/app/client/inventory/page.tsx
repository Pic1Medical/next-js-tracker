"use client";
import InputGroup from "@/src/components/InputGroup";
import { generateClient } from "aws-amplify/api";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { Schema } from "@amplify/data/resource";
import AddStockProductModal from "@/src/components/modals/AddStockProductModal";
import AddLocationModal from "@/src/components/modals/AddLocationModal";
import AddCategoryModal from "@/src/components/modals/AddCategoryModal";
import EditStockModal from "@/src/components/modals/EditStockModal";

const client = generateClient<Schema>();

function Form({
  busy,
  setBusy,
  setStock,
  setProduct,
  shouldRefresh,
  setRefresh,
  showOutOfStock,
  setShowOutOfStock,
}: {
  busy: boolean;
  setBusy: (v: boolean) => void;
  setStock: (v: Array<Schema["Stock"]["type"]>) => void;
  setProduct: (v: Array<Schema["Product"]["type"]>) => void;
  shouldRefresh: boolean;
  setRefresh: (v: boolean) => void;
  showOutOfStock: boolean;
  setShowOutOfStock: (v: boolean) => void;
}) {
  const [locations, setLocations] = useState<Array<[string, string]>>([]);
  const [categories, setCategories] = useState<Array<[string, string]>>([]);
  const [products, setProducts] = useState<Array<[string, string]>>([]);

  const categoryState = useState("");
  const locationState = useState("");
  const productState = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement> | undefined) => {
    if (e) e.preventDefault();
    setBusy(true);
    const filters: Record<string, unknown> = {};
    if (!showOutOfStock) {
      if (locationState[0].length > 0)
        filters["locationId"] = { eq: locationState[0] };
      if (productState[0].length > 0)
        filters["productId"] = { eq: productState[0] };
      client.models.Stock.list({
        filter: filters,
      })
        .then(async (v) => {
          if (typeof v.errors !== "undefined" || !v.data) {
            console.error(v.errors);
            throw new Error("Failed to retrieve stock data.");
          }
          if (categoryState[0].length > 0) {
            setStock(
              await v.data.filter(
                async (t) =>
                  (await t.product()).data?.categoryId == categoryState[0]
              )
            );
          } else setStock(v.data);
        })
        .catch(console.error)
        .finally(() => setBusy(false));
    } else {
      if (productState[0].length > 0) filters["id"] = { eq: productState[0] };
      if (categoryState[0].length > 0)
        filters["categoryId"] = { eq: categoryState[0] };
      client.models.Product.list({
        filter: filters,
      })
        .then(async (v) => {
          if (typeof v.errors !== "undefined" || !v.data) {
            console.error(v.errors);
            throw new Error("Failed to retrieve stock data.");
          }
          setProduct(v.data);
        })
        .catch(console.error)
        .finally(() => setBusy(false));
    }
  };

  useEffect(() => {
    if (shouldRefresh) {
      onSubmit(undefined);
      setRefresh(false);
    }
  }, [shouldRefresh]);

  useEffect(() => {
    const sub1 = client.models.Location.observeQuery().subscribe((v) =>
      setLocations(v.items.map((v) => [v.id, v.name]))
    );

    const sub2 = client.models.Category.observeQuery().subscribe((v) =>
      setCategories(v.items.map((v) => [v.id, v.name]))
    );

    const sub3 = client.models.Product.observeQuery().subscribe((v) =>
      setProducts(v.items.map((v) => [v.id, v.name]))
    );

    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    };
  }, []);

  return (
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
              disabled={showOutOfStock}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl mb-2">
            <InputGroup
              id="product-name"
              label="Product"
              list={products}
              state={productState}
            />
          </div>
          <div className="col-xl">
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
                data-bs-target="#add-stock-product-modal"
              >
                <i className="bi bi-plus-square" aria-hidden>
                  &nbsp;
                </i>
                Add&nbsp;Product
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
              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                data-bs-target="#add-category-modal"
              >
                <i className="bi bi-bookmark-plus" aria-hidden>
                  &nbsp;
                </i>
                Add&nbsp;Category
              </button>
              <div
                className="btn btn-outline-primary"
                onClick={() => setShowOutOfStock(!showOutOfStock)}
              >
                <label htmlFor="show-out-of-stock-products pointer-events-none">
                  Show OOS?
                </label>
                <input
                  id="show-out-of-stock-products"
                  className="form-check-input ms-2 pointer-events-none"
                  type="checkbox"
                  checked={showOutOfStock}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

function StockItem({
  stock,
  refresh,
  editStockId,
  setEditStockId,
}: {
  stock: Schema["Stock"]["type"];
  refresh: () => void;
  editStockId: string | undefined;
  setEditStockId: (id: string | undefined) => void;
}) {
  const [product, setProduct] = useState<Schema["Product"]["type"] | undefined>(
    undefined
  );
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
  const onDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you'd like to delete this item?"
    );
    if (!confirmed) return;
    client.models.Stock.delete({
      id: stock.id,
    })
      .catch(console.error)
      .finally(refresh);
  };
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
      <td>
        <div className="btn-group btn-group-xs">
          <button
            type="button"
            className="btn btn-outline-danger"
            aria-label="Delete Stock"
            onClick={onDelete}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            aria-label="Edit Stock"
            onClick={() => {
              if (editStockId === stock.id) setEditStockId(undefined);
              else setEditStockId(stock.id);
            }}
          >
            <input
              type="radio"
              className="form-check-input pointer-events-none"
              checked={editStockId === stock.id}
              readOnly
            />
          </button>
        </div>
      </td>
      <td>{product.name}</td>
      <td>{location.name}</td>
      <td>{stock.qty}</td>
    </tr>
  );
}

function Table({
  stock,
  busy,
  refresh,
  editStockId,
  setEditStockId,
}: {
  stock: Array<Schema["Stock"]["type"]>;
  busy: boolean;
  refresh: () => void;
  editStockId: string | undefined;
  setEditStockId: (id: string | undefined) => void;
}) {
  return (
    <>
      <table className="table table-rounded table-striped table-hover table-sm mx-2 my-1 w-auto">
        <thead className="table-primary">
          <tr>
            <th style={{ maxWidth: "40px" }}>
              <button
                className="btn btn-outline-primary btn-xs"
                data-bs-toggle="modal"
                data-bs-modal="#edit-stock-modal"
                disabled={editStockId === undefined}
              >
                <i className="bi bi-pencil-fill">&nbsp;</i>Edit&nbsp;Selected
              </button>
            </th>
            <th>Name</th>
            <th>Location</th>
            <th>Quantity</th>
          </tr>
        </thead>
        {!busy && (
          <tbody className="table-secondary">
            {stock.map((s) => (
              <StockItem
                stock={s}
                key={s.id}
                {...{ refresh, editStockId, setEditStockId }}
              />
            ))}
            {!stock.length && (
              <tr>
                <td colSpan={4}>No results...</td>
              </tr>
            )}
          </tbody>
        )}
        {busy && (
          <tbody className="table-secondary">
            <tr>
              <td colSpan={4}>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border" role="status">
                    <div className="visually-hidden">Loading</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </>
  );
}

function ProductItem({
  product,
  refresh,
}: {
  product: Schema["Product"]["type"];
  refresh: () => void;
}) {
  const [category, setCategory] = useState<
    Schema["Category"]["type"] | undefined
  >(undefined);
  useEffect(() => {
    product
      .category()
      .then((e) => setCategory(e.data ?? undefined))
      .catch(console.error);
  }, []);
  const onDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you'd like to delete this item?"
    );
    if (!confirmed) return;
    client.models.Product.delete({
      id: product.id,
    })
      .catch(console.error)
      .finally(refresh);
  };
  if (!category)
    return (
      <tr key={product.id}>
        <td colSpan={4} className="placeholder"></td>
      </tr>
    );
  return (
    <tr key={product.id}>
      <td>
        <div className="btn-group btn-group-xs">
          <button
            type="button"
            className="btn btn-outline-danger"
            aria-label="Delete Product"
            onClick={onDelete}
          >
            <i className="bi bi-x-lg"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            aria-label="Edit Product"
          >
            <input
              type="radio"
              className="form-check-input pointer-events-none"
              readOnly
            />
          </button>
        </div>
      </td>
      <td>{product.name}</td>
      <td>{category.name}</td>
      <td>{product.desc}</td>
    </tr>
  );
}

function ProductTable({
  product,
  busy,
  refresh,
}: {
  product: Array<Schema["Product"]["type"]>;
  busy: boolean;
  refresh: () => void;
}) {
  return (
    <table className="table table-rounded table-striped table-hover table-sm mx-2 my-1 w-auto">
      <thead className="table-primary">
        <tr>
          <th style={{ maxWidth: "40px" }}>
            <button
              className="btn btn-outline-primary btn-xs"
              data-bs-toggle="modal"
              data-bs-modal="#edit-stock-modal"
            >
              <i className="bi bi-pencil-fill">&nbsp;</i>Edit&nbsp;Selected
            </button>
          </th>
          <th>Name</th>
          <th>Category</th>
          <th>Product Description</th>
        </tr>
      </thead>
      {!busy && (
        <tbody className="table-secondary">
          {product.map((s) => (
            <ProductItem product={s} {...{ refresh }} />
          ))}
          {!product.length && (
            <tr>
              <td colSpan={4}>No results...</td>
            </tr>
          )}
        </tbody>
      )}
      {busy && (
        <tbody className="table-secondary">
          <tr>
            <td colSpan={4}>
              <div className="d-flex align-items-center justify-content-center">
                <div className="spinner-border" role="status">
                  <div className="visually-hidden">Loading</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      )}
    </table>
  );
}

export default function InventoryPage() {
  const [busy, setBusy] = useState(false);
  const [stock, setStock] = useState<Array<Schema["Stock"]["type"]>>([]);
  const [product, setProduct] = useState<Array<Schema["Product"]["type"]>>([]);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [shouldRefresh, setRefresh] = useState(false);
  const [editStockId, setEditStockId] = useState<string | undefined>(undefined);
  return (
    <>
      <Form
        {...{
          stock,
          setStock,
          product,
          setProduct,
          busy,
          setBusy,
          shouldRefresh,
          setRefresh,
          showOutOfStock,
          setShowOutOfStock,
        }}
      />
      {!showOutOfStock && (
        <Table
          {...{
            stock,
            busy,
            refresh() {
              setRefresh(true);
            },
            editStockId,
            setEditStockId,
          }}
        />
      )}
      {showOutOfStock && (
        <ProductTable
          {...{
            product,
            busy,
            refresh() {
              setRefresh(true);
            },
          }}
        />
      )}
      <AddLocationModal id="add-location-modal" />
      <AddCategoryModal id="add-category-modal" />
      <AddStockProductModal id="add-stock-product-modal" />
      {/* <EditStockModal id="edit-stock-modal" stockId={editStockId} /> */}
    </>
  );
}
