import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedLayoutWrapper";

export default async function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayoutWrapper
      requireAuth={false}
      wrapInErrorBoundary={true}
    >
      {children}
    </AuthenticatedLayoutWrapper>
  );
}