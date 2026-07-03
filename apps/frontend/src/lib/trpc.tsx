import type { AppRouter } from "@mc/trpc-api";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  httpBatchStreamLink,
  loggerLink,
  splitLink,
  TRPCClientError,
} from "@trpc/client";
import { createTRPCReact, getQueryKey } from "@trpc/react-query";
import SuperJSON from "superjson";

import { Errors } from "@mc/trpc-api/utils/errors";
import { REQUEST_TIMEOUT_MESSAGE } from "@mc/trpc-redis/Constants";

// Errors that describe a stable state (no session, no access, bot not in
// guild) or a bot-fleet timeout won't get better by asking again.
const NON_RETRYABLE_CODES = ["UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND"];

const retry = (failureCount: number, error: Error) => {
  if (error.message === Errors.NotAuthenticated) return false;
  if (error.message === REQUEST_TIMEOUT_MESSAGE) return false;
  if (
    error instanceof TRPCClientError &&
    NON_RETRYABLE_CODES.includes(
      (error.data as { code?: string } | undefined)?.code ?? "",
    )
  )
    return false;
  return failureCount < 3;
};

const createQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry,
      },
      queries: {
        retry,
        // Most dashboard data changes rarely; don't refire the whole query
        // cascade on every remount or tab switch.
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });

  // These mirror live Discord or bot state that changes outside the dashboard
  // (inviting the bot, reordering channels, granting permissions, the bot
  // updating counters), so refetch them whenever the window regains focus to
  // pick up those changes.
  const discordStateQueries = [
    getQueryKey(api.discord.userGuilds),
    getQueryKey(api.discord.getGuild),
    getQueryKey(api.guild.has),
    getQueryKey(api.guild.channels.logs),
    getQueryKey(api.bot.canBotEditChannel),
  ];
  for (const queryKey of discordStateQueries) {
    queryClient.setQueryDefaults(queryKey, {
      refetchOnWindowFocus: "always",
    });
  }

  return queryClient;
};

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const url = "/api/trpc";
  const headers = () => {
    const headers = new Headers();
    headers.set("x-trpc-source", "vite-react");
    return headers;
  };
  const transformer = SuperJSON;

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            import.meta.env.DEV ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            // Well known slow paths that will block other requests
            if (
              [
                "discord.userGuilds",
                "discord.getGuild",
                "discord.identify",
              ].includes(op.path)
            )
              return true;

            return op.context.useSlowLink === true;
          },
          true: httpBatchStreamLink({
            transformer,
            url,
            headers,
            fetch(url, options) {
              return fetch(url, {
                ...options,
                credentials: "include",
              });
            },
          }),
          false: httpBatchStreamLink({
            transformer,
            url,
            headers,
            fetch(url, options) {
              return fetch(url, {
                ...options,
                credentials: "include",
              });
            },
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
