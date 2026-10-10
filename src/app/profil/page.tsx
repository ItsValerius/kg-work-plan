import { getAuthenticatedUser, getSession } from "@/lib/auth/utils";
import { UserDataForm } from "@/components/features/profile/UserDataFrom";
import { PageContainer } from "@/components/layout/PageContainer";
import { getUserName } from "@/domains/users/queries";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Mein Profil",
};

/** Sends signed-out visitors to sign-in; renders nothing. */
async function RequireSignIn() {
  await getAuthenticatedUser("/profil");
  return null;
}

const ProfilePage = () => {
  // getSession is deduplicated per request, so this and RequireSignIn share one lookup.
  const user = getSession().then(async (session) =>
    session?.user
      ? { id: session.user.id, name: (await getUserName(session.user.id)) ?? "" }
      : null,
  );

  return (
    <PageContainer>
      <div className="mb-6 md:mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Mein Profil
        </h1>
        <small className="text-sm leading-none font-medium"></small>
      </div>
      <Suspense>
        <RequireSignIn />
      </Suspense>
      <UserDataForm user={user} />
    </PageContainer>
  );
};

export default ProfilePage;
