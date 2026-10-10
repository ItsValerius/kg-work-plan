import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedLayoutWrapper";

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticatedLayoutWrapper wrapInErrorBoundary={true}>{children}</AuthenticatedLayoutWrapper>
  );
}
