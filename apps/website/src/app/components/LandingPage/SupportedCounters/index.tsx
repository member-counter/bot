import {
  CakeSliceIcon,
  CalculatorIcon,
  ClockIcon,
  EditIcon,
  GamepadIcon,
  HourglassIcon,
  LinkIcon,
  PartyPopperIcon,
  SparklesIcon,
  TwitchIcon,
  UsersIcon,
  YoutubeIcon,
} from "lucide-react";

import { SupportedCountersCard } from "./Card";

// TODO add translations

export const SupportedCounters = () => (
  <div className="m-3 grid max-w-[1000px] grid-cols-1 gap-3 md:grid-cols-3 lg:m-0 lg:w-[1000px]">
    <SupportedCountersCard
      icon={UsersIcon}
      title="Members"
      description="Count and filter members by online status, roles, and other criteria to get precise insights about your community."
    />
    <SupportedCountersCard
      icon={ClockIcon}
      title="Clock"
      description="View the time in any timezone with our customizable clock. Perfect for coordinating across different regions."
    />
    <SupportedCountersCard
      icon={HourglassIcon}
      title="Countdown"
      description="Create and manage countdown timers tailored to your specific events or deadlines."
    />
    <SupportedCountersCard
      icon={GamepadIcon}
      title="Game"
      description="Monitor your game server’s activity with real-time player counts for over 320 supported games."
    />
    <SupportedCountersCard
      icon={LinkIcon}
      title="HTTP"
      description="Execute GET requests and receive data directly from any endpoint, streamlining your integration needs."
    />
    <SupportedCountersCard
      icon={CalculatorIcon}
      title="Math"
      description="Perform a range of mathematical operations including addition, subtraction, multiplication, and more on multiple numbers."
    />
    <SupportedCountersCard
      icon={PartyPopperIcon}
      title="Nitro Boosters"
      description="Track the number of Nitro boosters in your server to gauge community support and engagement."
    />
    <SupportedCountersCard
      icon={CakeSliceIcon}
      title="Reddit"
      description="Get statistics on any subreddit, including title, member count, and online members."
    />
    <SupportedCountersCard
      icon={EditIcon}
      title="Replace"
      description="Modify text dynamically with our powerful replacement tool, ideal in conjunction with the HTTP counter."
    />
    <SupportedCountersCard
      icon={TwitchIcon}
      title="Twitch"
      description="Monitor Twitch channel metrics such as follower count and view statistics to stay updated on your favorite streamers."
    />
    <SupportedCountersCard
      icon={YoutubeIcon}
      title="YouTube"
      description="Retrieve key metrics from YouTube channels including subscriber count, video count, and overall views."
    />
    <SupportedCountersCard
      icon={SparklesIcon}
      title="And Much More!"
      description="Discover even more features and counters that can enhance your experience. Stay tuned for updates!"
    />
  </div>
);
