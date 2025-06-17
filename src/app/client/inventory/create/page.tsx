import Link from "next/link";

export default function CreatePage() {
  return (
    <>
      <h2 className="mx-auto">Create new _________?</h2>
      <hr className="mt-0" />
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-md mb-2">
            <Link
              href="/client/inventory/create/stock"
              className="btn btn-lg btn-primary w-100"
            >
              <i
                className="bi bi-box-seam"
                aria-hidden
              >
                &nbsp;
              </i>
              Stock
            </Link>
          </div>
          <div className="col-md mb-2">
            <Link
              href="/client/inventory/create/product"
              className="btn btn-lg btn-primary w-100"
            >
              <i
                className="bi bi-cart"
                aria-hidden
              >
                &nbsp;
              </i>
              Product
            </Link>
          </div>
          <div className="col-md mb-2">
            <Link
              href="/client/inventory/create/location"
              className="btn btn-lg btn-primary w-100"
            >
              <i
                className="bi bi-geo-alt"
                aria-hidden
              >
                &nbsp;
              </i>
              Location
            </Link>
          </div>
          <div className="col-md">
            <Link
              href="/client/inventory/create/category"
              className="btn btn-lg btn-primary w-100"
            >
              <>
                <i
                  className="bi bi-tags"
                  aria-hidden
                >
                  &nbsp;
                </i>
                Category
              </>
            </Link>
          </div>
        </div>
      </div>
      <hr className="mt-2" />
    </>
  );
}
