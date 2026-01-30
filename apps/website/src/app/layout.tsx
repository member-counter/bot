import "~/globals.css";

import { Outlet } from "react-router";

import NavBar from "./components/NavBar";

export default function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
