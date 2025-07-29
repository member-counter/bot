"use client";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink, splitLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "~/server/api/root";
import { Errors } from "~/app/errors";
import { env } from "~/env";
import { Routes } from "~/other/routes";

const throwOnError = (error: Error) => {
  if (error.message === Errors.NotAuthenticated) {
    window.location.href = Routes.Login;
  }

  return false;
};

const retry = (failureCount: number, error: Error) => {
  return failureCount < 3 && error.message !== Errors.NotAuthenticated;
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      mutations: {
        throwOnError,
        retry,
      },
      queries: {
        throwOnError,
        retry,
      },
    },
  });

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
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

  const url = getBaseUrl() + "/api/trpc";
  const headers = () => {
    const headers = new Headers();
    headers.set("x-trpc-source", "nextjs-react");
    return headers;
  };
  const transformer = SuperJSON;

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            env.LOG_LEVEL === "debug" ||
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
          }),
          false: httpBatchStreamLink({
            transformer,
            url,
            headers,
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

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  // eslint-disable-next-line no-restricted-properties
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
