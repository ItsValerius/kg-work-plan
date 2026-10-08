import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import NavigationBar from "@/components/shared/navigation/NavigationBar";
import { ReactNode } from "react";

interface AuthenticatedLayoutWrapperProps {
    children: ReactNode;
    showLogoOnly?: boolean;
    wrapInErrorBoundary?: boolean;
}

/**
 * The page shell: static header frame and footer. Everything that needs the session
 * (navigation, page content) streams in behind Suspense boundaries; pages that require
 * sign-in check it themselves via getAuthenticatedUser().
 */
export function AuthenticatedLayoutWrapper({
    children,
    showLogoOnly = false,
    wrapInErrorBoundary = false,
}: AuthenticatedLayoutWrapperProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <NavigationBar showLogoOnly={showLogoOnly} />
            <div className={showLogoOnly ? "flex flex-1 items-center" : "flex-1"}>
                {wrapInErrorBoundary ? <ErrorBoundary>{children}</ErrorBoundary> : children}
            </div>
            <Footer />
        </div>
    );
}
