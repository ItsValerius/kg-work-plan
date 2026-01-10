import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedLayoutWrapper";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthenticatedLayoutWrapper
            requireAuth={false}
            showLogoOnly={true}
        >
            {children}
        </AuthenticatedLayoutWrapper>
    );
}
