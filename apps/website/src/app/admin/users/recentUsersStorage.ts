import { z } from "zod";

export const recentUsersKey = "recent-users";
export const recentUsersSchema = z.array(z.string());
export const defaultRecentUsers: string[] = [];
