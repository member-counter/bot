"use client";

import { LoadUserInput } from "../LoadUserInput";
import { RecentUsers } from "../RecentUsers";

export default function Layout({ children }: { children: React.ReactNode }) {
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
          {children}
        </div>
      </div>
    </>
  );
}
