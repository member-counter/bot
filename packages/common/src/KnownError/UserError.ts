export const UserErrorNames = ["USER_NOT_FOUND"] as const;

export type UserError = (typeof UserErrorNames)[number];
