import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedLayoutWrapper";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayoutWrapper requireAuth={true}>
      {children}
    </AuthenticatedLayoutWrapper>
  );
}
