import React, { useEffect, useState } from "react";
import { ChannelType } from "discord-api-types/v10";

import { cn } from "@mc/ui";

import DSelector from "../../DSelector";
import { serverListColor } from "./colors";
import { DescriptionArea } from "./DescriptionArea";
import { ServerNavMenu } from "./ServerNavMenu";

const demoServers = [
  {
    name: "Member Counter",
    icon: "https://media.discordapp.net/attachments/912366555713667072/912367865632534578/a_33cf18af873f3bede980af9650e99f1a.png?size=96",
    channels: [
      {
        type: ChannelType.GuildVoice,
        name: "616 Members",
      },
      {
        type: ChannelType.GuildVoice,
        name: "379 left to reach 1000!",
      },
      {
        type: ChannelType.GuildCategory,
        name: "6.3M USERS - 12K SERVERS!",
        isCounter: true,
      },
      {
        type: ChannelType.GuildText,
        name: "welcome",
      },
      {
        type: ChannelType.GuildAnnouncement,
        name: "announcements",
      },
      {
        type: ChannelType.GuildCategory,
        name: "📝chat",
      },
      {
        type: ChannelType.GuildText,
        name: "general",
        topic: "Casual Chat - 320 Online",
      },
      {
        type: ChannelType.GuildText,
        name: "off-topic",
        topic: "There are 79 cat pics in eduardozgz.com/max 👀",
      },
      {
        type: ChannelType.GuildText,
        name: "support",
        topic: "16 volunteers are ready to help you",
      },
    ],
    description:
      "This is the official Member Counter Support server, feel free to join and ask stuff in the right channels. We use channels here to see the members of this server and how many users and servers have the official bots.",
    invite: "https://discord.gg/g4MfV6N",
  },
  {
    name: "Hikari Support Server",
    icon: "https://media.discordapp.net/attachments/912366555713667072/912368842179772488/fb670f0539386769d23b438b02fdaea7.png?size=96",
    channels: [
      {
        type: ChannelType.GuildCategory,
        name: "📊 Bot Stats 📊",
      },
      {
        type: ChannelType.GuildVoice,
        name: "5.8K users",
      },
      {
        type: ChannelType.GuildVoice,
        name: "68 servers",
      },
      {
        type: ChannelType.GuildCategory,
        name: "INFORMATION",
      },
      {
        type: ChannelType.GuildText,
        name: "welcome",
      },
      {
        type: ChannelType.GuildText,
        name: "server-information",
      },
      {
        type: ChannelType.GuildText,
        name: "📜 server-rules 📜",
        topic: "36 Have accepted the rules",
      },
      {
        type: ChannelType.GuildAnnouncement,
        name: "server-announcements",
      },
      {
        type: ChannelType.GuildCategory,
        name: "GENERAL",
      },
      {
        type: ChannelType.GuildText,
        name: "talking",
        topic: "82 Online - Remember to read our rules!",
      },
      {
        type: ChannelType.GuildText,
        name: "memes",
        topic: "29 Memeing",
      },
    ],
    description:
      "This is the official Hikari Support server. Hikari is a free music and fun discord bot. They mainly use Member Counter to keep track of the total users and servers the bot is serving.",
    invite: "https://discord.gg/ReKmuSq7WT",
    inviteBot:
      "https://discord.com/api/oauth2/authorize?client_id=702638497860812901&permissions=292940912&scope=bot",
    inviteBotText: "Add Hikari to Discord",
  },
  {
    name: "Ah yes.. Among us..",
    icon: "https://media.discordapp.net/attachments/912366555713667072/912367243524980796/a_d9783375513bdf5f5c5c237b8fa1a5ca.gif?size=96",
    channels: [
      {
        type: ChannelType.GuildVoice,
        name: "☁️ Hà Nội│Hải Phòng 🌥",
      },
      {
        type: ChannelType.GuildVoice,
        name: "25° - 33° 🌡️ 25° - 32°",
      },
      {
        type: ChannelType.GuildVoice,
        name: "100 💧 94 │ 5% 🌧️ 0%",
      },
      {
        type: ChannelType.GuildCategory,
        name: "CHAT AND CHIT",
      },
      {
        type: ChannelType.GuildText,
        name: "🎨│role-settings",
      },
      {
        type: ChannelType.GuildText,
        name: "📆│schedule",
      },
      {
        type: ChannelType.GuildText,
        name: "💬│chat",
      },
      {
        type: ChannelType.GuildText,
        name: "💾│among-mod",
      },
    ],
    description: `
        A server for a group of close friends since the day Among Us broke the
        internet. We do gaming, watch movies together and all other fun things.
        They use the <code>{http}</code> counter to display data from
        OpenWeatherMap&apos;s free API. All data like min/max temperature of the
        day, humidity, chance of rain, are updated every 30 minutes to avoid
        hitting the API&apos;s rate limits. They also used the
        <code>{replace}</code> counter to convert OpenWeatherMap&apos;s icon
        codes to emojis.
      `,
  },
  {
    name: "Pencıl",
    icon: "https://media.discordapp.net/attachments/912366555713667072/912366979946528818/CrhDMN4.gif?size=96",
    channels: [
      {
        type: ChannelType.GuildVoice,
        name: "89 Üye",
      },
      {
        type: ChannelType.GuildVoice,
        name: "27 Aktif Üye",
      },
      {
        type: ChannelType.GuildCategory,
        name: "[📖] Önemli",
      },
      {
        type: ChannelType.GuildText,
        name: "kurallar",
        topic: "📕 74 Üye Kuralları Kabul Etti",
      },
      {
        type: ChannelType.GuildAnnouncement,
        name: "anonslar",
      },
      {
        type: ChannelType.GuildCategory,
        name: "[📋] Sunucu",
      },
      {
        type: ChannelType.GuildText,
        name: "giriş-çıkış",
      },
      {
        type: ChannelType.GuildCategory,
        name: "[💬] Sohbet",
      },
      {
        type: ChannelType.GuildText,
        name: "genel-sohbet",
        topic: "27 Aktif Üye - Lütfen kuralları okumayı unutmayın!",
      },
      {
        type: ChannelType.GuildText,
        name: "dosya-paylaşım",
      },
    ],
    description:
      "Sunucumuz insanları bir araya getirmeyi ve her zaman kurallara göre sohbet etmeyi amaçlamaktadır, Member Counter sayesinde sunucumuzdaki üye sayısını ve daha birçok istatistiği topluluğumuzla birlikte görüp takip ediyoruz.",
    invite: "https://discord.gg/N5yGQGvBAr",
    inviteText: "Sunucuya katıl",
  },
  {
    name: "Frosty's Ship",
    icon: "https://media.discordapp.net/attachments/912366555713667072/912366695597887529/FrostyPFP.gif?size=96",
    channels: [
      {
        type: ChannelType.GuildCategory,
        name: "❓ DOCK",
      },
      {
        type: ChannelType.GuildAnnouncement,
        name: "announcements",
      },
      {
        type: ChannelType.GuildText,
        name: "rules",
      },
      {
        type: ChannelType.GuildText,
        name: "server-updates",
      },
      {
        type: ChannelType.GuildVoice,
        name: "87 Members",
      },
    ],
    description:
      "The Community around Frosty as well for gaming & just chilling.\nThey use Member Counter's to keep track of the members in the server",
    invite: "https://discord.gg/gf99YCTAwX",
  },
];

//  TODO fetch from backend
export function DiscordDemo() {
  const [mouseIsHovering, setMouseIsHovering] = useState(false);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [selectedChannelIndex, setSelectedChannelIndex] = useState(-1);
  const selectedServer = demoServers[selectedServerIndex];

  useEffect(() => {
    if (!mouseIsHovering) {
      const serverSelection = setInterval(() => {
        let nextServer = selectedServerIndex + 1;
        if (nextServer === demoServers.length) nextServer = 0;
        setSelectedServerIndex(nextServer);
      }, 7 * 1000);
      return () => {
        clearInterval(serverSelection);
      };
    }
  }, [mouseIsHovering, selectedServerIndex]);

  useEffect(() => {
    if (!selectedServer) return;
    setSelectedChannelIndex(
      selectedServer.channels.findIndex(
        (channel) =>
          channel.type === ChannelType.GuildText ||
          channel.type === ChannelType.GuildAnnouncement,
      ),
    );
  }, [selectedServer]);

  if (!selectedServer) return null;

  return (
    <div
      className={cn("flex h-[550px] w-[1000px] overflow-hidden rounded-lg")}
      style={{ backgroundColor: serverListColor }}
      role="none"
      tabIndex={-1}
      onMouseEnter={() => setMouseIsHovering(true)}
      onMouseLeave={() => setMouseIsHovering(false)}
      onFocus={() => setMouseIsHovering(true)}
      onBlur={() => setMouseIsHovering(false)}
    >
      <DSelector
        pre={[]}
        guilds={demoServers.map((server, i) => ({
          ...server,
          isSelected: i === selectedServerIndex,
          onClick: () => setSelectedServerIndex(i),
        }))}
      />
      <ServerNavMenu
        demoServer={selectedServer}
        selectedChannelIndex={selectedChannelIndex}
        setSelectedChannelIndex={setSelectedChannelIndex}
      />
      <DescriptionArea
        demoServer={selectedServer}
        selectedChannelIndex={selectedChannelIndex}
      />
    </div>
  );
}
