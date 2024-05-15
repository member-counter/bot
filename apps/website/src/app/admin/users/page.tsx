import type { Metadata } from "next";
import { Suspense } from "react";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";

import { Errors } from "~/app/errors";
import { api } from "~/trpc/server";
import { LoadUser } from "./LoadUser";

export const metadata: Metadata = { title: "Manage users - Member Counter" };
export default async function Page() {
  const authUser = await api.session.user();
  const userPerms = new BitField(authUser.permissions);

  if (userPerms.missing(UserPermissions.SeeUsers | UserPermissions.ManageUsers))
    throw new Error(Errors.NotAuthorized);

  return (
    <Suspense>
      <LoadUser />
    </Suspense>
  );
}
