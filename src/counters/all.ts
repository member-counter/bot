import TestCounter from "./test";
import ErrorCounter from "./error";
import BannedMembersCounter from "./bannedMembers";
import BotStatsCounter from "./bot-stats";
import ChannelCounter from "./channels";
import ClockCounter from "./clock";
import CountdownCounter from "./countdown";
import GameCounter from "./game";
import HTTPCounter from "./http";
import InstagramCounter from "./Instagram";
import MemberCounter from "./members";
import MembersPlayingCounter from "./membersPlaying";
import MembersConnectedCounter from "./membersConnected";
import MembersExtendedCounter from "./membersExt";
import MembersWithRoleCounter from "./membersWithRole";
import MemeratorCounter from "./Memerator";
import NitroBoostersCounter from "./nitroBoosters";
import RolesCounter from "./roles";
import StaticCounter from "./static";
import TwitchCounter from "./Twitch";
import TwitterCounter from "./Twitter";
import YouTubeCounter from "./YouTube";

const counters = [
	TestCounter,
	ErrorCounter,
	BannedMembersCounter,
	BotStatsCounter,
	ChannelCounter,
	ClockCounter,
	CountdownCounter,
	GameCounter,
	HTTPCounter,
	InstagramCounter,
	MemberCounter,
	MembersPlayingCounter,
	MembersConnectedCounter,
	MembersExtendedCounter,
	MembersWithRoleCounter,
	MemeratorCounter,
	NitroBoostersCounter,
	RolesCounter,
	StaticCounter,
	TwitchCounter,
	TwitterCounter,
	YouTubeCounter
];

export default counters;
