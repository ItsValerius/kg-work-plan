import { buttonVariants } from "@/components/ui/button";
import { getSession, hasSessionCookie } from "@/lib/auth/utils";
import { isAdminRole } from "@/lib/auth/roles";
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
      <Link href="/anmelden" className={buttonVariants({ variant: "outline" })}>
        Anmelden
      </Link>
    );
  }

  const userIsAdmin = isAdminRole(session.user.role);
  return (
    <>
      <DesktopNavigation isAdmin={userIsAdmin} />
      <MobileNavigation isAdmin={userIsAdmin} />
    </>
  );
}

/**
 * Holds the header's shape while the session is looked up, so nothing jumps. Sized like a
 * helper's navigation (three links, divider, Abmelden), the most common case.
 */
export function SessionNavPlaceholder() {
  return (
    <div aria-hidden="true" className="flex items-center">
      <div className="hidden items-center lg:flex">
        {["w-[167px]", "w-[165px]", "w-[88px]"].map((slot) => (
          <span key={slot} className={`flex h-16 items-center justify-center ${slot}`}>
            <span className="skeleton h-4 w-3/4" />
          </span>
        ))}
        <span className="ml-2 border-l pl-2">
          <span className="flex h-11 w-[123px] items-center justify-center">
            <span className="skeleton h-4 w-20" />
          </span>
        </span>
      </div>
      <span className="skeleton h-11 w-[93px] rounded-lg lg:hidden" />
    </div>
  );
}
