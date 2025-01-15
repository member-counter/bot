import { useMemo } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import type { RouterOutputs } from "~/trpc/react";
import mainBotIcon from "./assets/bot-main.png";
import premiumBotIcon from "./assets/bot-premium.png";
import { ChildStats } from "./ChildStats";
import { MissingChildStats } from "./MissingChildStats";

export function BotStatus({
  id,
  stats,
}: RouterOutputs["bot"]["getStatus"][number]) {
  const { t } = useTranslation();

  const icon =
    id === "main" ? mainBotIcon : id === "premium" ? premiumBotIcon : null;

  const name =
    id === "main"
      ? "Member Counter"
      : id === "premium"
        ? "Member Counter Premium"
        : "Unknown";

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
        {icon && <Image {...icon} alt="" className="h-6 w-6 rounded-md" />}
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
