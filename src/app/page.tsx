import Link from "next/link";
import { Button } from "../components/ui/button";
import { LinkIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="w-svw h-svh flex items-center justify-center">
      <section className="bg-card text-card-foreground border rounded flex flex-col items-center">
        <h1 className="text-xl font-bold">Pic1Medical</h1>
        <h2 className="text-lg font-semibold text-destructive">
          (Internal Use Only)
        </h2>
        <hr className="w-full" />
        <p className="max-w-120 px-4 py-2">
          The website you are attempting to access is only to be used by members
          of the Pic1Medical company. Proceeding beyond this point indicates
          that you have express permission to access this website. Click{" "}
          <Button
            asChild
            variant="link"
          >
            <Link href="/client/dashboard">
              here <LinkIcon />{" "}
            </Link>
          </Button>{" "}
          to continue further onto this website.
        </p>
      </section>
    </main>
  );
}
