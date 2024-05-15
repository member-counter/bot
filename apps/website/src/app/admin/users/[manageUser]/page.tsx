import type { Metadata } from "next";
import { Suspense } from "react";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";

import { Errors } from "~/app/errors";
import { api } from "~/trpc/server";
import ManageUser from "./ManageUser";

interface Props {
  params: { manageUser: string };
}

export const metadata: Metadata = { title: "Manage user - Member Counter" };
export default async function Page({ params }: Props) {
  const authUser = await api.session.user();
  const userPerms = new BitField(authUser.permissions);

  if (
    userPerms.missing(UserPermissions.SeeGuilds | UserPermissions.ManageGuilds)
  )
    throw new Error(Errors.NotAuthorized);

  return (
    <Suspense>
      <ManageUser userId={params.manageUser} />
    </Suspense>
  );
}
