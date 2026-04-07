import { Route, Routes } from "react-router";

import { routes } from "@mc/common/Routes";

import { Lazy } from "./app/components/Lazy";
import { ProtectedRoute } from "./app/components/ProtectedRoute";
import RootLayout from "./app/layout";
import Home from "./app/page";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Home */}
        <Route index element={<Home />} />

        {/* Auth */}
        <Route
          path={routes.login.$path({ relative: true })}
          element={Lazy(() => import("./app/login/page"))}
        />
        <Route
          path={routes.logout.$path({ relative: true })}
          element={Lazy(() => import("./app/logout/page"))}
        />
        <Route
          path={routes.account.$path({ relative: true })}
          element={
            <ProtectedRoute>
              {Lazy(() => import("./app/account/page"))}
            </ProtectedRoute>
          }
        />

        {/* Public pages */}
        <Route
          path={routes.status.$path({ relative: true })}
          element={Lazy(() => import("./app/status/page"))}
        />
        <Route
          path={routes.donors.$path({ relative: true })}
          element={Lazy(() => import("./app/donors/page"))}
        />
        <Route
          path={routes.donate.$path({ relative: true })}
          element={Lazy(() => import("./app/donate/page"))}
        />
        <Route
          path={routes.docs.$path({ relative: true })}
          element={Lazy(() => import("./app/docs/page"))}
        />
        <Route
          path={routes.support.$path({ relative: true })}
          element={Lazy(() => import("./app/support/page"))}
        />
        <Route
          path={routes.premium.$path({ relative: true })}
          element={Lazy(() => import("./app/premium/page"))}
        />
        <Route
          path={routes.invite.$path({ relative: true })}
          element={Lazy(() => import("./app/invite/page"))}
        />
        <Route
          path={routes.repository.$path({ relative: true })}
          element={Lazy(() => import("./app/repository/page"))}
        />
        <Route
          path={routes.translate.$path({ relative: true })}
          element={Lazy(() => import("./app/translate/page"))}
        />

        {/* Legal */}
        <Route path={routes.legal.$path({ relative: true })}>
          <Route index element={Lazy(() => import("./app/legal/page"))} />
          <Route
            path={routes.legal.$.page.$path({ relative: true })}
            element={Lazy(() => import("./app/legal/[page]/page"))}
          />
        </Route>

        {/* Dashboard */}
        <Route
          path={routes.dashboard.$path({ relative: true })}
          element={
            <ProtectedRoute>
              {Lazy(() => import("./app/dashboard/layout"))}
            </ProtectedRoute>
          }
        >
          <Route index element={Lazy(() => import("./app/dashboard/page"))} />
          <Route path={routes.dashboard.$.servers.$path({ relative: true })}>
            <Route
              index
              element={Lazy(() => import("./app/dashboard/servers/page"))}
            />
            <Route
              path={routes.dashboard.$.servers.$.server.$path({
                relative: true,
              })}
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
                path={routes.dashboard.$.servers.server.$.channel.$path({
                  relative: true,
                })}
                element={Lazy(
                  () =>
                    import(
                      "./app/dashboard/servers/[guildId]/[channelId]/layout"
                    ),
                )}
              >
                <Route
                  index
                  element={Lazy(
                    () =>
                      import(
                        "./app/dashboard/servers/[guildId]/[channelId]/page"
                      ),
                  )}
                />
              </Route>
              <Route
                path={routes.dashboard.$.servers.server.$.settings.$path({
                  relative: true,
                })}
                element={Lazy(
                  () =>
                    import(
                      "./app/dashboard/servers/[guildId]/settings/layout"
                    ),
                )}
              >
                <Route
                  index
                  element={Lazy(
                    () =>
                      import(
                        "./app/dashboard/servers/[guildId]/settings/page"
                      ),
                  )}
                />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Admin */}
        <Route path={routes.admin.$path({ relative: true })}>
          <Route
            path={routes.admin.$.users.$path({ relative: true })}
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
              path={routes.admin.$.users.$.user.$path({ relative: true })}
              element={Lazy(() => import("./app/admin/users/[id]/layout"))}
            >
              <Route
                index
                element={Lazy(() => import("./app/admin/users/[id]/page"))}
              />
            </Route>
          </Route>
          <Route
            path={routes.admin.$.guilds.$path({ relative: true })}
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
            path={routes.admin.$.homepage.$path({ relative: true })}
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
            <Route
              path={routes.admin.$.homepage.$.demoServers.$path({
                relative: true,
              })}
            >
              <Route
                index
                element={Lazy(
                  () => import("./app/admin/homepage/demo-servers/page"),
                )}
              />
              <Route
                path={routes.admin.$.homepage.$.demoServers.$.demoServer.$path({
                  relative: true,
                })}
                element={Lazy(
                  () => import("./app/admin/homepage/demo-servers/[id]/page"),
                )}
              />
            </Route>
          </Route>
          <Route
            path={routes.admin.$.donations.$path({ relative: true })}
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
              path={routes.admin.$.donations.$.donation.$path({
                relative: true,
              })}
              element={Lazy(() => import("./app/admin/donations/[id]/page"))}
            />
            <Route
              path={routes.admin.$.donations.$.new.$path({
                relative: true,
              })}
              element={Lazy(() => import("./app/admin/donations/new/page"))}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={Lazy(() => import("./app/not-found"))} />
      </Route>
    </Routes>
  );
}
