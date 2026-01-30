import { BrowserRouter, Route, Routes } from "react-router";
import React from "react";

import { ProtectedRoute } from "./app/components/ProtectedRoute";
import { LoadingPage } from "./app/components/LoadingPage";
import RootLayout from "./app/layout";
import Home from "./app/page";

const Lazy = (importPath: string) => (
  <React.Suspense fallback={<LoadingPage />}>
    {React.createElement(React.lazy(() => import(importPath)))}
  </React.Suspense>
);

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* Auth */}
          <Route path="login" element={Lazy("./app/login/page")} />
          <Route path="logout" element={Lazy("./app/logout/page")} />
          <Route path="account" element={
            <ProtectedRoute>
              {Lazy("./app/account/page")}
            </ProtectedRoute>
          } />

          {/* Public pages */}
          <Route path="status" element={Lazy("./app/status/page")} />
          <Route path="donors" element={Lazy("./app/donors/page")} />
          <Route path="donate" element={Lazy("./app/donate/page")} />
          <Route path="docs" element={Lazy("./app/docs/page")} />
          <Route path="support" element={Lazy("./app/support/page")} />
          <Route path="premium" element={Lazy("./app/premium/page")} />
          <Route path="invite" element={Lazy("./app/invite/page")} />
          <Route path="repository" element={Lazy("./app/repository/page")} />
          <Route path="translate" element={Lazy("./app/translate/page")} />

          {/* Legal */}
          <Route path="legal">
            <Route index element={Lazy("./app/legal/page")} />
            <Route path=":page" element={Lazy("./app/legal/[page]/page")} />
          </Route>

          {/* Dashboard */}
          <Route path="dashboard" element={
            <ProtectedRoute>
              {Lazy("./app/dashboard/layout")}
            </ProtectedRoute>
          }>
            <Route index element={Lazy("./app/dashboard/page")} />
            <Route path="servers/:guildId" element={Lazy("./app/dashboard/servers/[guildId]/layout")}>
              <Route index element={Lazy("./app/dashboard/servers/[guildId]/page")} />
              <Route path=":channelId" element={Lazy("./app/dashboard/servers/[guildId]/[channelId]/layout")}>
                <Route index element={Lazy("./app/dashboard/servers/[guildId]/[channelId]/page")} />
              </Route>
              <Route path="settings" element={Lazy("./app/dashboard/servers/[guildId]/settings/layout")}>
                <Route index element={Lazy("./app/dashboard/servers/[guildId]/settings/page")} />
              </Route>
            </Route>
          </Route>

          {/* Admin */}
          <Route path="admin">
            <Route path="users" element={Lazy("./app/admin/users/layout")}>
              <Route index element={Lazy("./app/admin/users/page")} />
              <Route path=":userId" element={Lazy("./app/admin/users/[id]/layout")}>
                <Route index element={Lazy("./app/admin/users/[id]/page")} />
              </Route>
            </Route>
            <Route path="guilds" element={Lazy("./app/admin/guilds/layout")}>
              <Route index element={Lazy("./app/admin/guilds/page")} />
            </Route>
            <Route path="homepage" element={Lazy("./app/admin/homepage/layout")}>
              <Route index element={Lazy("./app/admin/homepage/page")} />
              <Route path="demo-servers" >
                <Route index element={Lazy("./app/admin/homepage/demo-servers/page")} />
                <Route path=":id" element={Lazy("./app/admin/homepage/demo-servers/[id]/page")} />
              </Route>
            </Route>
            <Route path="donations" element={Lazy("./app/admin/donations/layout")}>
              <Route index element={Lazy("./app/admin/donations/page")} />
              <Route path=":id" element={Lazy("./app/admin/donations/[id]/page")} />
              <Route path="new" element={Lazy("./app/admin/donations/new/page")} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={Lazy("./app/not-found")} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
