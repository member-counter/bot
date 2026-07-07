import { api } from "~/lib/trpc";

/**
 * The current user's autosave preference. Stored per-user on the server (so it
 * follows the user across devices) and surfaced through `session.user`.
 */
export function usePrefersAutosave(): boolean {
  const user = api.session.user.useQuery();
  return user.data?.prefersAutosave ?? false;
}
