import { z } from "zod/v4";

export const recentUsersKey = "recent-users";
export const recentUsersSchema = z.array(z.string());
export const defaultRecentUsers: string[] = [];
