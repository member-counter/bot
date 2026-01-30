import { useLocation } from "react-router";

import { BitField } from "@mc/common/BitField";
import { routes } from "@mc/common/Routes";
import { UserPermissions } from "@mc/common/UserPermissions";
import { Errors } from "@mc/trpc-api/utils/errors";

import { api } from "~/lib/trpc";
import ErrorPage from "./error";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: (keyof typeof UserPermissions)[];
}

/**
 * Wrapper component for protected routes that require authentication.
 * Optionally checks for specific permissions.
 */
export function ProtectedRoute({
  children,
  requiredPermissions,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { data: session, isPending } = api.session.user.useQuery(undefined, {
    retry: false,
  });

  // Show nothing while loading (or could show a loading spinner)
  if (isPending) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!session) {
    window.location.href = routes.api.auth.$buildPath({
      searchParams: { redirect_to: location.pathname },
    });
    return null;
  }

  // Check permissions if required
  if (requiredPermissions) {
    const requiredPermissionsBitfield = requiredPermissions.reduce(
      (acc, cur) => acc | UserPermissions[cur],
      0n,
    );

    const hasAllRequiredPermissions = new BitField(session.permissions).has(
      requiredPermissionsBitfield,
    );

    if (!hasAllRequiredPermissions) {
      return <ErrorPage error={new Error(Errors.NotAuthorized)} />;
    }
  }

  return <>{children}</>;
}
