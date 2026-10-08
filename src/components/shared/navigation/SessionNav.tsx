import { buttonVariants } from "@/components/ui/button";
import { getSession, hasSessionCookie, isAdmin } from "@/lib/auth/utils";
import Link from "next/link";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

/** The session-dependent part of the header; streams in after the static shell. */
export async function SessionNav() {
  const session = await getSession();

  if (!session?.user) {
    // Unknown session state (database unreachable): offer no auth control at all.
    if (await hasSessionCookie()) return null;
    return (
      <Link href="/signin" className={buttonVariants({ variant: "outline" })}>Anmelden</Link>
    );
  }

  const userIsAdmin = isAdmin(session);
  return (
    <>
      <DesktopNavigation isAdmin={userIsAdmin} />
      <MobileNavigation isAdmin={userIsAdmin} />
    </>
  );
}

/** Holds the header's shape while the session is looked up, so nothing jumps. */
export function SessionNavPlaceholder() {
  return (
    <div aria-hidden="true" className="flex items-center gap-6">
      <span className="skeleton hidden h-4 w-28 lg:block" />
      <span className="skeleton hidden h-4 w-28 lg:block" />
      <span className="skeleton hidden h-4 w-16 lg:block" />
      <span className="skeleton h-11 w-24 rounded-lg lg:hidden" />
    </div>
  );
}
