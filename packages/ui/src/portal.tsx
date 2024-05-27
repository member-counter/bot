"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import * as PortalPrimitive from "@radix-ui/react-portal";

export const Portal = (
  props: PropsWithChildren & { container?: HTMLElement },
) => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    setRendered(true);
  }, []);

  if (!rendered) return null;
  return (
    <PortalPrimitive.Root asChild container={props.container}>
      {props.children}
    </PortalPrimitive.Root>
  );
};
