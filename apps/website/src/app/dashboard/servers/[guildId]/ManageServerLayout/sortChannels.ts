import { ChannelType } from "discord-api-types/v10";

export const sortChannels = <
  C extends {
    id: string;
    parentId: string | null;
    position: number | false;
    type: ChannelType;
  },
>(
  channels: C[],
): C[] => {
  channels.sort((a) => Number(a.parentId));
  channels.sort((a, b) => Number(a.position) - Number(b.position));
  channels.sort((a, b) =>
    Number(
      [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(b.type),
    ),
  );
  channels.sort((a) =>
    Number(
      [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(a.type),
    ),
  );

  const orphanChannels = channels.filter(
    (c) => !c.parentId && c.type !== ChannelType.GuildCategory,
  );

  const categoriesChannels = channels.filter(
    (c) => c.type === ChannelType.GuildCategory,
  );

  const categorizedChannels = categoriesChannels.flatMap((category) => {
    const childrenChannels = channels.filter((c) => c.parentId === category.id);
    return [category, ...childrenChannels];
  });

  return [...orphanChannels, ...categorizedChannels];
};
