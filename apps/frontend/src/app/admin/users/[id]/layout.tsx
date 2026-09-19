import { Outlet } from "react-router";

import { LoadUserInput } from "../LoadUserInput";
import { RecentUsers } from "../RecentUsers";

export default function Layout() {
  return (
    <>
      <div className="hidden sm:block">
        <RecentUsers />
      </div>
      <div className="flex-grow">
        <div className="flex w-full flex-col gap-2">
          <div className="block sm:hidden">
            <LoadUserInput />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
