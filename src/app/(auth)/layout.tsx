import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedLayoutWrapper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayoutWrapper showLogoOnly={true}>{children}</AuthenticatedLayoutWrapper>;
}
