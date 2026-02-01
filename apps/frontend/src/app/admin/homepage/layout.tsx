import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="m-2 flex flex-row justify-center gap-2">
      <div className="w-[800px]">
        <Outlet />
      </div>
    </div>
  );
}
