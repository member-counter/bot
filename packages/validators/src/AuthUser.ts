import type {
  DefaultUserAvatarAssets} from "discord-api-types/v10";
import {
  CDNRoutes,
  ImageFormat,
} from "discord-api-types/v10";
import { z } from "zod";

export interface AuthUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
}

export const AuthUserSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    discriminator: z.string(),
    avatar: z.string().optional(),
  })
  .transform((user) => {
    const defaultAvatarIndex = (
      user.discriminator === "0"
        ? Number((BigInt(user.id) >> 22n) % 6n)
        : Number(user.discriminator) % 5
    ) as DefaultUserAvatarAssets;

    const avatar = user.avatar
      ? CDNRoutes.userAvatar(user.id, user.avatar, ImageFormat.PNG)
      : CDNRoutes.defaultUserAvatar(defaultAvatarIndex);

    return {
      ...user,
      avatar,
    };
  });
