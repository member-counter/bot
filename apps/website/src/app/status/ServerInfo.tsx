import { CpuIcon, MemoryStickIcon, ServerIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@mc/ui/popover";

import type { RouterOutputs } from "~/trpc/react";

export function ServerInfo({
  host: { name, cpus, freeMemory, memory, loadAvg },
}: NonNullable<RouterOutputs["bot"]["getStatus"][number]["stats"]>[number]) {
  const { t, i18n } = useTranslation();
  const recentLoadAvg = loadAvg[0] ?? 0;

  const memoryUsage = ((memory - freeMemory) / memory) * 100;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={"icon"}
          className=" h-full w-full rounded-none "
        >
          <ServerIcon
            className="h-4 w-4"
            aria-label={t("pages.status.serverInformation.title")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {t("pages.status.serverInformation.title")}
            </h4>
          </div>
          <div className="grid gap-2 whitespace-pre-wrap [&>div>div>div:not(:first-child)]:text-muted-foreground [&>div]:flex [&>div]:gap-2 [&_svg]:h-6 [&_svg]:w-6">
            <div>
              <ServerIcon />
              <div>
                <div>{t("pages.status.serverInformation.hostname")}</div>
                <div>{name}</div>
              </div>
            </div>
            <div>
              <CpuIcon />
              <div>
                <div>{t("pages.status.serverInformation.cpuLabel")}</div>
                <div>
                  {t("pages.status.serverInformation.cpuInfo", {
                    cores: cpus,
                    load: recentLoadAvg.toFixed(2),
                  })}
                </div>
              </div>
            </div>
            <div>
              <MemoryStickIcon />
              <div>
                <div>{t("pages.status.serverInformation.memoryLabel")}</div>
                <div>
                  {t("pages.status.serverInformation.memoryInfo", {
                    memory: prettyBytes(memory, { locale: i18n.language }),
                    usage: memoryUsage.toFixed(0),
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
