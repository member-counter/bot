"use client";

import ErrorPage from "./error";
import { Errors } from "./errors";

export default function NotFound() {
  return <ErrorPage error={new Error(Errors.NotFound)} />;
}
