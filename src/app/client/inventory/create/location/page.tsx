"use client";
import { LocationType } from "@amplify/data/inventory/location";
import { Schema } from "@amplify/data/resource";
import { generateClient } from "@aws-amplify/api";
import useForm from "@lib/ui/Form";

const client = generateClient<Schema>();

export default function CreateLocationPage() {
  const form = useForm<LocationType>([
    {
      breakPoint: "sm",
      fields: [
        {
          name: "name",
          label: "Name",
          initialValue: "",
          fieldProps: { required: true },
          async options(v: string) {
            const result = await client.models.Location.list({
              filter: {
                name: {
                  contains: v as string,
                },
              },
              limit: 100,
            });
            if (result.data) return result.data.map((e) => [e.id, e.name]);
            throw new Error(`Failed to retrieve locations from AWS Amplify`);
          },
          async validator(v: string, options) {
            const errors = [];
            for (const option of options) {
              if ((option[1] ?? option[0]) === v) {
                errors.push(`Each location must have a unique name; duplicate location found with name: "${v}".`);
                break;
              }
            }
            return errors;
          },
        },
      ],
    },
    {
      fields: [
        {
          name: "desc",
          label: "Description",
          initialValue: "",
        },
      ],
    },
  ]);
  return (
    <>
      <h4 className="mx-auto">
        <i
          className="bi bi-geo-alt-fill"
          aria-hidden
        >
          &nbsp;
        </i>
        New Location
      </h4>
      <hr className="mt-0" />
      <form.Form id="create-location-form">
        {[
          {
            type: "submit",
            label: (
              <>
                <i
                  className="bi bi-plus-square"
                  aria-hidden
                >
                  &nbsp;
                </i>
                Create
              </>
            ),
          },
          {
            type: "reset",
            label: (
              <>
                <i
                  className="bi bi-x-lg"
                  aria-hidden
                >
                  &nbsp;
                </i>
                Clear
              </>
            ),
          },
        ]}
      </form.Form>
      <hr />
    </>
  );
}
