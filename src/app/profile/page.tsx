import { getAuthenticatedUser } from "@/lib/auth/utils";
import { UserDataForm } from "@/components/features/profile/UserDataFrom";
import { PageContainer } from "@/components/layout/PageContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Profil",
};

const ProfilePage = async () => {
  const user = await getAuthenticatedUser();

  return (
    <PageContainer>
      <div className="mb-6 md:mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Mein Profil
        </h1>
        <small className="text-sm font-medium leading-none"></small>
      </div>
      <UserDataForm user={user} />
    </PageContainer>
  );
};

export default ProfilePage;
