import type { ChannelType } from "discord-api-types/v10";

export interface DemoServer {
  name: string;
  channels: {
    name: string;
    type: ChannelType;
    topic?: string;
  }[];
  description: string;
  links?: { href: string; label: string }[];
}
