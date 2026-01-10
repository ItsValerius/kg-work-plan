import { getSession, isAdmin } from "@/lib/auth/utils";
import Footer from "@/components/layout/Footer";
import NavigationBar from "@/components/shared/navigation/NavigationBar";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

interface AuthenticatedLayoutWrapperProps {
    children: ReactNode;
    requireAuth?: boolean;
    showLogoOnly?: boolean;
    wrapInErrorBoundary?: boolean;
}

export async function AuthenticatedLayoutWrapper({
    children,
    requireAuth = true,
    showLogoOnly = false,
    wrapInErrorBoundary = false,
}: AuthenticatedLayoutWrapperProps) {
    const session = await getSession();
    const user = session?.user;

    if (requireAuth && !user) {
        redirect("/signin");
    }

    // isAdmin is synchronous when session is provided, no await needed
    const userIsAdmin = isAdmin(session);
    // Show sign in button automatically when: user is not logged in AND not logo-only mode (auth pages)
    const shouldShowSignInButton = !user && !showLogoOnly;
    const shouldCenterContent = showLogoOnly;

    const content = wrapInErrorBoundary ? (
        <ErrorBoundary>{children}</ErrorBoundary>
    ) : (
        children
    );

    const contentWrapperClass = shouldCenterContent
        ? "flex-1 flex items-center justify-center px-4"
        : "flex-1";

    return (
        <div className="flex flex-col min-h-screen">
            <NavigationBar
                isAdmin={userIsAdmin}
                showSignInButton={shouldShowSignInButton}
                showLogoOnly={showLogoOnly}
            />
            <div className={contentWrapperClass}>{content}</div>
            <Footer />
        </div>
    );
}
