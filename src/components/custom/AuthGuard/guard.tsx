"use client";
import { getCurrentUser } from "aws-amplify/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../../ui/spinner";
import StateManager from "./states";

export default function AuthGuard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isSignedIn, setSignInState] = useState<boolean | undefined>(undefined);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      setSignInState(typeof user == "object" && !!user);
    })().catch(() => {
      setSignInState(false);
    });
  }, [pathname, nonce]);

  if (typeof isSignedIn == "boolean") {
    if (isSignedIn) return children;

    return <StateManager refresh={setNonce} />;
  }

  return (
    <main className="w-svw h-svh flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <Spinner />
        <span>Loading...</span>
      </div>
    </main>
  );
}
