import InputGroup from "@/src/components/InputGroup";

export const Categories = ["test", "desc", "lamp"];

export default function InventoryPage() {
  return (
    <>
      <form className="mx-2 my-1">
        <fieldset className="container-fluid">
          <legend>Inventory Search</legend>
          <div className="row">
            <div className="col-md mb-2">
              <InputGroup id="Category" label="Category" list={Categories} />
            </div>
            <div className="col-md mb-2">
              <InputGroup id="Locations" label="Locations" list={Categories} />
            </div>
          </div>
          <div className="row">
            <div className="col-md mb-2">
              <InputGroup id="product-name" label="Product" />
            </div>
            <div className="col-md">
              <div className="btn-group">
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
        </fieldset>
      </form>
      <table className="table table-rounded table-striped table-hover table-sm mx-2 my-1 w-auto">
        <thead className="table-primary">
          <tr>
            <th>#</th>
          </tr>
        </thead>
        <tbody className="table-secondary">
          <tr>
            <td>0</td>
          </tr>
          <tr>
            <td>0</td>
          </tr>
          <tr>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
