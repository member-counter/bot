import "~/globals.css";

import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";

import NavBar from "./components/NavBar";

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <>
      <meta name="description" content={t("meta.description")} />
      <NavBar />
      <Outlet />
    </>
  );
}
