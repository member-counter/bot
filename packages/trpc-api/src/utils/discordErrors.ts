import { DiscordAPIError } from "@discordjs/rest";
import { TRPCError } from "@trpc/server";

import { Errors } from "./errors";

/**
 * Handle unauthorized Discord API errors by converting them to tRPC errors.
 * This is used when Discord returns a 401, indicating the access token is invalid.
 */
export function handleUnauthorizedDiscordError(error: unknown): never {
  if (error instanceof DiscordAPIError && error.status === 401) {
    // Destroying the session here wouldn't work because tRPC has already sent some body
    // in the response, so we can't send set-cookie headers.
    // This needs to be handled on the client side.
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: Errors.NotAuthenticated,
    });
  }

  throw error;
}
