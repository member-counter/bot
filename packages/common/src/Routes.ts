import { parser, route } from "react-router-typesafe-routes";
import { zod } from "react-router-typesafe-routes/zod";
import { z } from "zod/v4";

export const LegalPagesSlugs = [
  "terms-of-service",
  "privacy-policy",
  "cookie-policy",
  "acceptable-use-policy",
] as const;
export type LegalPagesSlugs = (typeof LegalPagesSlugs)[number];

export const routes = route({
  path: "",
  children: {
    login: route({ path: "login" }),
    logout: route({ path: "logout" }),
    account: route({ path: "account" }),
    status: route({ path: "status" }),
    donors: route({ path: "donors" }),
    donate: route({ path: "donate" }),
    docs: route({ path: "docs" }),
    support: route({ path: "support" }),
    premium: route({ path: "premium" }),
    repository: route({ path: "repository" }),
    translate: route({ path: "translate" }),
    invite: route({
      path: "invite",
      searchParams: { guildId: zod(z.string()) },
    }),
    legal: route({
      path: "legal",
      searchParams: {
        page: zod(z.enum(LegalPagesSlugs).optional(), parser("string")),
      },
      children: {
        page: route({
          path: ":page",
          params: {
            page: zod(z.enum(LegalPagesSlugs), parser("string")).defined(),
          },
        }),
      },
    }),
    dashboard: route({
      path: "dashboard",
      children: {
        servers: route({
          path: "servers",
          children: {
            server: route({
              path: ":guildId",
              params: { guildId: zod(z.string().optional()) },
              children: {
                channel: route({
                  path: ":channelId",
                  params: { channelId: zod(z.string()) },
                }),
                settings: route({ path: "settings" }),
              },
            }),
            new: route({ path: "new" }),
          },
        }),
      },
    }),
    admin: route({
      path: "admin",
      children: {
        users: route({
          path: "users",
          children: {
            user: route({
              path: ":userId",
              params: { userId: zod(z.string()).defined() },
            }),
          },
        }),
        guilds: route({ path: "guilds" }),
        homepage: route({
          path: "homepage",
          children: {
            demoServers: route({
              path: "demo-servers",
              children: {
                demoServer: route({
                  path: ":id",
                  params: { id: zod(z.string()).defined() },
                }),
              },
            }),
          },
        }),
        donations: route({
          path: "donations",
          children: {
            donation: route({
              path: ":id",
              params: { id: zod(z.string()).defined() },
            }),
            new: route({ path: "new" }),
          },
        }),
      },
    }),
    api: route({
      path: "api",
      children: {
        auth: route({
          path: "auth",
          searchParams: { redirect_to: zod(z.string().optional()) },
          children: {
            logout: route({ path: "logout" }),
          },
        }),
      },
    }),
  },
});
