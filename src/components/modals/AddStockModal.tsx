import { FormEvent, useEffect, useState } from "react";
import Modal from "../Modal";
import { Schema } from "@amplify/data/resource";
import { useEntries } from "@/src/hooks/Amplify";
import { generateClient } from "aws-amplify/api";
import { ApplyState } from "@/src/hooks/UI";

const client = generateClient<Schema>();

export default function AddStockModal({ id }: { id: string }) {
  const nameState = useState("");
  const descState = useState("");
  const categoryState = useState("");
  const locationState = useState("");
  const onSubmit = async () => {
    //client.models.Category.get({});
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
    <Modal title="Add Stock" {...{ id, onSubmit }}>
      <div className="row">
        <div className="col mb-2">
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
      <div className="row">
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
      </div>
    </Modal>
  );
}
