import { env } from "../env";

export const legalPagesSlugs = [
  "terms-of-service",
  "privacy-policy",
  "cookie-policy",
  "acceptable-use-policy",
] as const;

export type LegalPagesSlugs = (typeof legalPagesSlugs)[number];

function formatURL(url: string, unparsedParams: Record<string, string>) {
  const searchParams = new URLSearchParams(unparsedParams).toString();

  return [url, searchParams].filter(Boolean).join("?");
}

export const Routes = (baseUrl: string) => ({
  Home: baseUrl + "/",
  Login: baseUrl + "/login",
  LogOut: baseUrl + "/logout",
  ApiLogin: (redirectTo?: string) =>
    baseUrl +
    formatURL("/api/auth", { ...(redirectTo && { redirect_to: redirectTo }) }),
  ApiLogout: baseUrl + "/api/auth/logout",
  Support: env.NEXT_PUBLIC_SUPPORT_URL,
  Documentation: env.NEXT_PUBLIC_BOT_DOCS_URL,
  BotRepository: env.NEXT_PUBLIC_BOT_REPO_URL,
  Translate: env.NEXT_PUBLIC_TRANSLATION_PLATFORM_URL,
  Donors: baseUrl + "/donors",
  Invite: (guildId?: string) =>
    baseUrl + formatURL("/invite", { ...(guildId && { guildId }) }),
  Legal: (page: LegalPagesSlugs) => baseUrl + formatURL("/legal", { page }),
  ManageUsers: (userId?: string) =>
    baseUrl + "/admin/users" + (userId ? `/${userId}` : ""),
  ManageGuilds: baseUrl + "/admin/guilds",
  ManageHomePage: baseUrl + "/admin/homepage",
  ManageHomeDemoServer: (id: string) =>
    baseUrl + "/admin/homepage/demo-servers/" + id,
  ManageDonations: (id?: string) =>
    baseUrl + "/admin/donations" + (id ? `/${id}` : ""),
  ManageDonationsNew: () => baseUrl + "/admin/donations/new",
  Sentry: env.NEXT_PUBLIC_SENTRY_ADMIN_URL,
  Account: baseUrl + "/account",
  Dashboard: baseUrl + "/dashboard",
  DashboardServers: (guildId?: string, channelId?: string) =>
    baseUrl +
    "/dashboard/servers" +
    (guildId ? `/${guildId}` : "") +
    (channelId ? `/${channelId}` : ""),
  CreateDiscordServer: "https://discord.com/channels/@me",
  Status: "/status",
});
