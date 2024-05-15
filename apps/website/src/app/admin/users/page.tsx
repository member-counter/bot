import type { Metadata } from "next";
import { Suspense } from "react";

import { LoadUser } from "./LoadUser";

export const metadata: Metadata = { title: "Manage users - Member Counter" };
export default function Page() {
  return (
    <Suspense>
      <LoadUser />
    </Suspense>
  );
}
