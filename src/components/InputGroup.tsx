export default function InputGroup({
  children,
  list,
  id,
  label: _labelText,
}: {
  id: string;
  label: string;
  list?: (string | [string, string])[];
  children?:
    | {
        Label: (props: {
          children: string;
          for: string;
          className: string;
        }) => React.ReactNode;
        Input: (props: {
          id: string;
          className: string;
          list?: string;
        }) => React.ReactNode;
      }
    | ((props: { id: string }) => Element);
}) {
  const HasChildren = typeof children === "object";
  const Label = (HasChildren ? children.Label : undefined) ?? "label";
  const Input = (HasChildren ? children.Input : undefined) ?? "input";
  return (
    <div className="input-group">
      <Label for={id} className="input-group-text">
        {_labelText}
      </Label>
      {list && (
        <datalist id={`${id}-datalist`}>
          {list.map((v) => {
            if (typeof v === "string") return <option value={v}>{v}</option>;
            return <option value={v[1]}>{v[0]}</option>;
          })}
        </datalist>
      )}
      <Input
        id={id}
        className="form-control"
        list={list ? `${id}-datalist` : ""}
      />
    </div>
  );
}
