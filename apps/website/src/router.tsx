import { BrowserRouter, Route, Routes } from "react-router";

import { Lazy } from "./app/components/Lazy";
import { ProtectedRoute } from "./app/components/ProtectedRoute";
import RootLayout from "./app/layout";
import Home from "./app/page";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* Home */}
          <Route index element={<Home />} />

          {/* Auth */}
          <Route
            path="login"
            element={Lazy(() => import("./app/login/page"))}
          />
          <Route
            path="logout"
            element={Lazy(() => import("./app/logout/page"))}
          />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                {Lazy(() => import("./app/account/page"))}
              </ProtectedRoute>
            }
          />

          {/* Public pages */}
          <Route
            path="status"
            element={Lazy(() => import("./app/status/page"))}
          />
          <Route
            path="donors"
            element={Lazy(() => import("./app/donors/page"))}
          />
          <Route
            path="donate"
            element={Lazy(() => import("./app/donate/page"))}
          />
          <Route path="docs" element={Lazy(() => import("./app/docs/page"))} />
          <Route
            path="support"
            element={Lazy(() => import("./app/support/page"))}
          />
          <Route
            path="premium"
            element={Lazy(() => import("./app/premium/page"))}
          />
          <Route
            path="invite"
            element={Lazy(() => import("./app/invite/page"))}
          />
          <Route
            path="repository"
            element={Lazy(() => import("./app/repository/page"))}
          />
          <Route
            path="translate"
            element={Lazy(() => import("./app/translate/page"))}
          />

          {/* Legal */}
          <Route path="legal">
            <Route index element={Lazy(() => import("./app/legal/page"))} />
            <Route
              path=":page"
              element={Lazy(() => import("./app/legal/[page]/page"))}
            />
          </Route>

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                {Lazy(() => import("./app/dashboard/layout"))}
              </ProtectedRoute>
            }
          >
            <Route index element={Lazy(() => import("./app/dashboard/page"))} />
            <Route
              path="servers/:guildId"
              element={Lazy(
                () => import("./app/dashboard/servers/[guildId]/layout"),
              )}
            >
              <Route
                index
                element={Lazy(
                  () => import("./app/dashboard/servers/[guildId]/page"),
                )}
              />
              <Route
                path=":channelId"
                element={Lazy(
                  () =>
                    import("./app/dashboard/servers/[guildId]/[channelId]/layout"),
                )}
              >
                <Route
                  index
                  element={Lazy(
                    () =>
                      import("./app/dashboard/servers/[guildId]/[channelId]/page"),
                  )}
                />
              </Route>
              <Route
                path="settings"
                element={Lazy(
                  () =>
                    import("./app/dashboard/servers/[guildId]/settings/layout"),
                )}
              >
                <Route
                  index
                  element={Lazy(
                    () =>
                      import("./app/dashboard/servers/[guildId]/settings/page"),
                  )}
                />
              </Route>
            </Route>
          </Route>

          {/* Admin */}
          <Route path="admin">
            <Route
              path="users"
              element={
                <ProtectedRoute requiredPermissions={["ManageUsers"]}>
                  {Lazy(() => import("./app/admin/users/layout"))}
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={Lazy(() => import("./app/admin/users/page"))}
              />
              <Route
                path=":userId"
                element={Lazy(() => import("./app/admin/users/[id]/layout"))}
              >
                <Route
                  index
                  element={Lazy(() => import("./app/admin/users/[id]/page"))}
                />
              </Route>
            </Route>
            <Route
              path="guilds"
              element={
                <ProtectedRoute requiredPermissions={["ManageGuilds"]}>
                  {Lazy(() => import("./app/admin/guilds/layout"))}
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={Lazy(() => import("./app/admin/guilds/page"))}
              />
            </Route>
            <Route
              path="homepage"
              element={
                <ProtectedRoute requiredPermissions={["ManageHomePage"]}>
                  {Lazy(() => import("./app/admin/homepage/layout"))}
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={Lazy(() => import("./app/admin/homepage/page"))}
              />
              <Route path="demo-servers">
                <Route
                  index
                  element={Lazy(
                    () => import("./app/admin/homepage/demo-servers/page"),
                  )}
                />
                <Route
                  path=":id"
                  element={Lazy(
                    () => import("./app/admin/homepage/demo-servers/[id]/page"),
                  )}
                />
              </Route>
            </Route>
            <Route
              path="donations"
              element={
                <ProtectedRoute requiredPermissions={["ManageDonations"]}>
                  {Lazy(() => import("./app/admin/donations/layout"))}
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={Lazy(() => import("./app/admin/donations/page"))}
              />
              <Route
                path=":id"
                element={Lazy(() => import("./app/admin/donations/[id]/page"))}
              />
              <Route
                path="new"
                element={Lazy(() => import("./app/admin/donations/new/page"))}
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={Lazy(() => import("./app/not-found"))} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
