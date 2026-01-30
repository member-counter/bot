import { Outlet } from "react-router";

import { BlockedBanner } from "./BlockedBanner";
import { InviteBotBanner } from "./InviteBotBanner";
import LayoutInner from "./layoutInner";
import { UserPermissionsContextProvider } from "./UserPermissionsContext";

export default function Layout() {
  return (
    <UserPermissionsContextProvider>
      <div className="flex h-full max-h-full flex-col overflow-hidden rounded">
        <BlockedBanner />
        <InviteBotBanner />
        <div className="grow overflow-hidden">
          <LayoutInner>
            <Outlet />
          </LayoutInner>
        </div>
      </div>
    </UserPermissionsContextProvider>
  );
}
