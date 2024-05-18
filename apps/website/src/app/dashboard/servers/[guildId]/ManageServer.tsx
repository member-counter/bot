import React from "react";

interface Props {
  children: React.ReactNode;
}

export function ManageServer({ children }: Props) {
  return <>{children}</>;
}
