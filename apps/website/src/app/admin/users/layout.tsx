import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="m-2 flex flex-row justify-center gap-2">
      <Outlet />
    </div>
  );
}
