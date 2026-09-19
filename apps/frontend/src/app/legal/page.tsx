import { Navigate } from "react-router";
import { useTypedSearchParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";

export default function Page() {
  const [{ page }] = useTypedSearchParams(routes.legal);
  return (
    <Navigate
      to={routes.legal.page.$buildPath({
        params: { page: page ?? "terms-of-service" },
      })}
      replace
    />
  );
}
