import { routes } from "@mc/common/Routes";

export default function Page() {
  window.location.replace(routes.api.auth.logout.$buildPath({}));
  return null;
}
