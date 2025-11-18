import type { i18n } from "i18next";
import { UsersIcon } from "lucide-react";

import {
  DataSourceId,
  FilterMode,
  MembersFilterAccountType,
  MembersFilterStatus,
} from "@mc/common/DataSource";

import { createDataSourceMetadata } from "./createDataSourceMetadata";

const MemberFilterStatusTkey = {
  [MembersFilterStatus.ANY]: "any",
  [MembersFilterStatus.ONLINE]: "online",
  [MembersFilterStatus.IDLE]: "idle",
  [MembersFilterStatus.DND]: "dnd",
  [MembersFilterStatus.OFFLINE]: "offline",
} as const;

const MembersFilterAccountTypeTKey = {
  [MembersFilterAccountType.ANY]: "any",
  [MembersFilterAccountType.USER]: "user",
  [MembersFilterAccountType.BOT]: "bot",
} as const;

const MembersRoleFilteringTypeTKey = {
  [FilterMode.OR]: "any",
  [FilterMode.AND]: "overlapping",
} as const;

export const createDataSourceMetadataMembers = (i18n: i18n) =>
  createDataSourceMetadata({
    dataSourceId: DataSourceId.MEMBERS,
    tKeyName: "members",
    icon: UsersIcon,
    i18n,
    displayName(dataSource, t) {
      if (!dataSource.options) return t("name");

      const {
        accountTypeFilter,
        bannedMembers,
        playing,
        roleFilterMode,
        roles,
        statusFilter,
        connectedTo,
      } = dataSource.options;

      if (bannedMembers) return t("display.bannedMembers");

      return t("display.syntax", {
        accountType: t(
          `display.accountType.${MembersFilterAccountTypeTKey[accountTypeFilter ?? MembersFilterAccountType.ANY]}`,
        ),
        accountStatus: t(
          `display.accountStatus.${MemberFilterStatusTkey[statusFilter ?? MembersFilterStatus.ANY]}`,
        ),
        roleFiltering: roles?.length
          ? t(
              `display.roleFiltering.${MembersRoleFilteringTypeTKey[roleFilterMode ?? FilterMode.OR]}`,
            )
          : "",
        connectedToAChannel: connectedTo?.length
          ? t(`display.connectedToAChannel`)
          : "",
        playingAGame: playing?.length ? t(`display.playingAGame`) : "",
        interpolation: { escapeValue: false },
      })
        .split(/\s+/)
        .join(" ");
    },
  });
