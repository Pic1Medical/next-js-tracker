import React, { FormEvent, useRef, useState } from "react";

interface Props {
  id: string;
  title: string;
  autoDismiss?: boolean;
  onSubmit: () => Promise<void>;
  onReset?: () => void;
  children: React.ReactNode;
}

export default function Modal({
  id,
  title,
  autoDismiss,
  children,
  ...props
}: Props) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    props
      .onSubmit()
      .catch(console.error)
      .finally(() => {
        setBusy(false);
        if (autoDismiss) {
          if (closeBtn.current) {
            closeBtn.current.click();
          }
          (e.target as HTMLFormElement).reset();
        }
      });
  };

  const onReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    if (props.onReset) props.onReset();
    setBusy(false);
  };

  return (
    <div
      className="modal"
      tabIndex={-1}
      id={id}
      data-bs-backdrop={busy ? "static" : undefined}
      data-bs-keyboard={busy ? "false" : undefined}
    >
      <div className="modal-dialog" role="dialog">
        <div className="modal-content">
          <form onSubmit={onSubmit} onReset={onReset}>
            <fieldset disabled={busy}>
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  ref={closeBtn}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">{children}</div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
