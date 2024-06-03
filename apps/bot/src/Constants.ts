import { enforcePathAsValue } from "./utils/enforcePathAsValue";

export const DiscordBrandingColors = {
  Red: 0xed4245,
  Green: 0x57f287,
  Yellow: 0xfee75c,
  Blurple: 0x5865f2,
  Fuchsia: 0xeb459e,
  White: 0xffffff,
  Black: 0x000000,
} as const;

export const BrandingColors = {
  Primary: 0xea580c,
};

export const InteractionId = enforcePathAsValue({
  Profile: {
    DeleteUserProfile: {
      Button: null,
      Modal: null,
      ModalConfirmationText: null,
    },
  },
});

InteractionId.Profile.DeleteUserProfile.ModalConfirmationText === "ab";
