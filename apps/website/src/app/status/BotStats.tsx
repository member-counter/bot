import type { StaticImageData } from "next/image";
import { useMemo } from "react";
import Image from "next/image";
import { BotIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { RouterOutputs } from "~/trpc/react";
import betaBotIcon from "./assets/bot-beta.png";
import mainBotIcon from "./assets/bot-main.png";
import premiumBotIcon from "./assets/bot-premium.png";
import { ChildStats } from "./ChildStats";
import { MissingChildStats } from "./MissingChildStats";

const KnownPublicBots = {
  main: {
    name: "Member Counter",
    icon: mainBotIcon,
  },
  premium: {
    name: "Member Counter Premium",
    icon: premiumBotIcon,
  },
  beta: {
    name: "Member Counter Beta",
    icon: betaBotIcon,
  },
} as Record<string, { name: string; icon: StaticImageData }>;

export function BotStatus({
  id,
  stats,
}: RouterOutputs["bot"]["getStatus"][number]) {
  const { t } = useTranslation();

  const icon = KnownPublicBots[id]?.icon ?? null;
  const name = KnownPublicBots[id]?.name ?? t("common.unknownPublicBot");

  const totalShards = stats?.[0]?.shardCount ?? 0;
  const unreportedShards: number[] = useMemo(() => {
    if (!stats) return [];

    const unreportedShards = new Set(
      Array.from({ length: totalShards }, (_, i) => i),
    );

    const reportedShards = stats.reduce(
      (acc, cur) => acc.concat(cur.shards),
      [] as number[],
    );

    for (const shard of reportedShards) {
      unreportedShards.delete(shard);
    }

    return [...unreportedShards];
  }, [stats, totalShards]);

  return (
    <article className="flex w-full max-w-[1200px] flex-col gap-2">
      <h1 className="flex items-center gap-2 text-lg font-bold">
        {icon ? (
          <Image {...icon} alt="" className="h-6 w-6 rounded-md" />
        ) : (
          <BotIcon className="h-5 w-5" />
        )}
        {name}
      </h1>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {stats ? (
          <>
            {stats
              .sort((a, b) => a.childId.localeCompare(b.childId))
              .map((stats) => (
                <ChildStats key={stats.childId} {...stats} />
              ))}

            {!!unreportedShards.length && !!totalShards && (
              <MissingChildStats
                shardCount={totalShards}
                missingShards={unreportedShards}
              />
            )}
          </>
        ) : (
          t("pages.status.statusUnavailable")
        )}
      </div>
    </article>
  );
}
