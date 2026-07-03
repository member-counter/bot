import { api } from "~/lib/trpc";

/**
 * The logged-in user's guild list, shared by every component that renders it.
 *
 * The empty map is only a rendering placeholder: `initialDataUpdatedAt: 0`
 * marks it as already stale so the real fetch always fires despite the
 * query client's global `staleTime`.
 */
export function useUserGuilds() {
  return api.discord.userGuilds.useQuery(undefined, {
    initialData: () => ({ userGuilds: new Map() }),
    initialDataUpdatedAt: 0,
  });
}
