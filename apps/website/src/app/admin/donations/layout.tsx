import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="m-2 flex flex-row justify-center gap-2">
      <div className="flex w-[800px] flex-col gap-3">
        <Outlet />
      </div>
    </div>
  );
}
