"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import * as PortalPrimitive from "@radix-ui/react-portal";

export const Portal = (props: PropsWithChildren) => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  if (!rendered) return null;
  return <PortalPrimitive.Root asChild>{props.children}</PortalPrimitive.Root>;
};
