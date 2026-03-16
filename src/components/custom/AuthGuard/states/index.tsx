"use state";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./index.module.css";
import PasswordState from "./password";
import { autoSignIn } from "aws-amplify/auth";

export type States = "password" | "signed-in" | "error" | undefined;
export interface StateProps {
  setState: Dispatch<SetStateAction<States>>;
}

export default function StateManager({
  refresh,
}: Readonly<{ refresh: (t: (t: number) => number) => void }>) {
  const [state, setState] = useState<States>(undefined);
  useEffect(() => {
    if (state == "signed-in") refresh((n) => n + 1);
  }, [state, refresh]);

  useEffect(() => {
    if (!setState) return;
    autoSignIn()
      .then((res) => {
        if (res.isSignedIn) setState("signed-in");
        else setState("password");
      })
      .catch((err) => {
        //console.error(err);
        setState("password");
      });
  }, [setState]);

  let Comp: (props: Readonly<StateProps>) => React.ReactNode = () => null;
  switch (state) {
    case "password":
      Comp = PasswordState;
      break;
    default:
      return null;
  }

  return (
    <main className={styles["auth-layout-main"]}>
      <div className={styles["auth-layout-container"]}>
        <div className="self-center bg-card border rounded px-2 py-2 mb-2">
          <img
            src="/pic1medical-logo.png"
            alt="Pic1Medical Icon"
            className="w-fit h-20"
          />
        </div>
        <Comp setState={setState} />
      </div>
    </main>
  );
}
