import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedLayoutWrapper";

export default function MeineAufgabenLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayoutWrapper>{children}</AuthenticatedLayoutWrapper>;
}
