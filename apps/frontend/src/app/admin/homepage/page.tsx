import { Navigate } from "react-router";

import { routes } from "@mc/common/Routes";

export default function Page() {
  return (
    <Navigate to={routes.admin.homepage.demoServers.$buildPath({})} replace />
  );
}
