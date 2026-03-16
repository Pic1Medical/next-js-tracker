"use client";
import { AuthUser, getCurrentUser } from "aws-amplify/auth";
import { DatabaseIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TrackerPage() {
  const [user, setUser] = useState<AuthUser | undefined>();
  useEffect(() => {
    (async () => {
      setUser(await getCurrentUser());
    })().catch((err) => {
      console.error(err);
    });
  }, []);
  return (
    <>
      <section className="container px-4 mx-auto">
        <div className="px-4 py-3 border rounded bg-sidebar text-sidebar-foreground">
          <h1 className="text-2xl font-semibold border-b border-muted">
            Howdy,{" "}
            <span className="text-sidebar-primary font-bold">
              {user?.signInDetails?.loginId}
            </span>
            !
          </h1>
          <p className="mt-3 px-1.5 indent-5">
            To get started with the Tracker, use the menubar at the top of the
            screen to navigate and operate the tracker.
          </p>
        </div>
      </section>
    </>
  );
}
