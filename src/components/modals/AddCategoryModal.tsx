"use client";
import { FormEvent, useEffect, useState } from "react";
import Modal from "../Modal";
import { Schema } from "@amplify/data/resource";
import { useEntries } from "@/src/hooks/Amplify";
import { generateClient } from "aws-amplify/api";
import Input from "../Input";
import { ApplyState } from "@/src/hooks/UI";

const client = generateClient<Schema>();

export default function AddCategoryModal({ id }: { id: string }) {
  const nameState = useState("");
  const descState = useState("");
  const onSubmit = async () => {
    const result = await client.models.Category.create({
      name: nameState[0],
      desc: descState[0].length ? descState[0] : undefined,
    });
    if (result.errors) {
      console.log(result);
      throw new Error("Failed to create new Location.");
    }
  };

  return (
    <Modal title="Add Category" {...{ id, onSubmit }}>
      <div className="row">
        <div className="col mb-2">
          <div className="form-group">
            <label htmlFor={`${id}-field-name`} className="form-label required">
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
