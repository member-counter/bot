import { Errors } from "@mc/trpc-api/utils/errors";

import ErrorPage from "./components/error";

export default function NotFound() {
  return <ErrorPage error={new Error(Errors.NotFound)} />;
}
