import type { ComponentType } from "react";
import { createElement, lazy, Suspense } from "react";

import { LoadingPage } from "./LoadingPage";

export function Lazy(load: () => Promise<{ default: ComponentType }>) {
  return (
    <Suspense fallback={<LoadingPage />}>{createElement(lazy(load))}</Suspense>
  );
}
