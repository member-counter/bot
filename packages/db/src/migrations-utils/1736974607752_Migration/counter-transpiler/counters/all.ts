import type ConvertCounter from "../types/ConvertCounter";
import { safeCounterName } from "../safeCounterName";
import BannedMembersCounter from "./bannedMembers";
import BotStatsCounter from "./bot-stats";
import ChannelCounter from "./channels";
import ClockCounter from "./clock";
import CountdownCounter from "./countdown";
import EscapeCounter from "./escape";
import GameCounter from "./game";
import HTTPCounter from "./http";
import MathCounter from "./Math";
import MemberCounter from "./members";
import MembersConnectedCounter from "./membersConnected";
import MembersExtendedCounter from "./membersExt";
import MembersOnlineApproximatedCounter from "./membersOnlineApproximated";
import MembersPlayingCounter from "./membersPlaying";
import MembersWithRoleCounter from "./membersWithRole";
import MemeratorCounter from "./Memerator";
import NitroBoostersCounter from "./nitroBoosters";
import reddit from "./reddit";
import ReplaceCounter from "./replace";
import RolesCounter from "./roles";
import StaticCounter from "./static";
import TwitchCounter from "./Twitch";
import TwitterCounter from "./Twitter";
import YouTubeCounter from "./YouTube";

const counters: ConvertCounter[] = [
  BannedMembersCounter,
  BotStatsCounter,
  ChannelCounter,
  ClockCounter,
  CountdownCounter,
  GameCounter,
  HTTPCounter,
  MemberCounter,
  MembersPlayingCounter,
  MembersConnectedCounter,
  MembersExtendedCounter,
  MembersOnlineApproximatedCounter,
  MembersWithRoleCounter,
  MemeratorCounter,
  NitroBoostersCounter,
  reddit,
  RolesCounter,
  StaticCounter,
  TwitchCounter,
  TwitterCounter,
  YouTubeCounter,
  MathCounter,
  ReplaceCounter,
  EscapeCounter,
].map((counter) => {
  counter.aliases = counter.aliases.map((alias) => safeCounterName(alias));
  return counter;
});

export default counters;
