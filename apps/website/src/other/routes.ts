import type { LegalPagesSlugs } from "~/app/legal/legalPages";
import { env } from "~/env";

function formatURL(url: string, unparsedParams: Record<string, string>) {
  const searchParams = new URLSearchParams(unparsedParams).toString();

  return [url, searchParams].filter(Boolean).join("?");
}

export const Routes = {
  Home: "/",
  Login: "/login",
  LogOut: "/logout",
  ApiLogin: (redirectTo?: string) =>
    formatURL("/api/auth", { ...(redirectTo && { redirect_to: redirectTo }) }),
  ApiLogout: "/api/auth/logout",
  Support: env.NEXT_PUBLIC_SUPPORT_URL,
  Documentation: env.NEXT_PUBLIC_BOT_DOCS_URL,
  BotRepository: env.NEXT_PUBLIC_BOT_REPO_URL,
  Translate: env.NEXT_PUBLIC_TRANSLATION_PLATFORM_URL,
  Donors: "/donors",
  Invite: (guildId?: string) =>
    formatURL("/invite", { ...(guildId && { guildId }) }),
  Legal: (page: LegalPagesSlugs) => formatURL("/legal", { page }),
  ManageUsers: (userId?: string) =>
    "/admin/users" + (userId ? `/${userId}` : ""),
  ManageGuilds: "/admin/guilds",
  Sentry: env.NEXT_PUBLIC_SENTRY_ADMIN_URL,
  Account: "/account",
  Dashboard: "/dashboard",
  DashboardServers: (guildId?: string, channelId?: string) =>
    "/dashboard/servers" +
    (guildId ? `/${guildId}` : "") +
    (channelId ? `/${channelId}` : ""),
};
