import type { AppRouter } from "@mc/trpc-api";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink, splitLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import { Errors } from "@mc/trpc-api/utils/errors";

const retry = (failureCount: number, error: Error) => {
  return failureCount < 3 && error.message !== Errors.NotAuthenticated;
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      mutations: {
        retry,
      },
      queries: {
        retry,
      },
    },
  });

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
