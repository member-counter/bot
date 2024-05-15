import type { Metadata } from "next";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";

import { Errors } from "~/app/errors";
import { api } from "~/trpc/server";

export const metadata: Metadata = { title: "Manage users - Member Counter" };

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await api.session.user();
  const userPerms = new BitField(authUser.permissions);

  if (userPerms.missing(UserPermissions.SeeUsers | UserPermissions.ManageUsers))
    throw new Error(Errors.NotAuthorized);

  return (
    <div className="m-2 flex flex-row justify-center gap-2">{children}</div>
  );
}
