import { useEffect, useState } from "react";
import { PlusIcon, SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { CardContent, CardFooter } from "@mc/ui/card";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Textarea } from "@mc/ui/textarea";

import useConfirmOnLeave from "~/hooks/useConfirmOnLeave";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import { ChannelCard } from "./ChannelCard";
import { DeleteButton } from "./DeleteButton";
import { LinkCard } from "./LinkCard";

export default function ManageDemoServer({ id }: { id: string }) {
  const { t } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);

  const demoServer = api.demoServers.get.useQuery({ id: id });
  const demoServerMutation = api.demoServers.update.useMutation();
  const [mutableDemoServer, _setMutableDemoServer] = useState<
    typeof demoServer.data | null
  >(null);

  useConfirmOnLeave(isDirty);

  useEffect(() => {
    if (!demoServer.data) return;
    _setMutableDemoServer(demoServer.data);
  }, [demoServer.data]);

  if (!mutableDemoServer) return;

  const setMutableDemoServer = (value: typeof demoServer.data) => {
    _setMutableDemoServer(value);
    setIsDirty(true);
  };

  const saveDemoServer = async () => {
    await demoServerMutation.mutateAsync({
      ...mutableDemoServer,
    });
    setIsDirty(false);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await saveDemoServer();
      }}
    >
      <CardContent className="flex flex-col gap-4 [&>*]:flex [&>*]:flex-col [&>*]:gap-2">
        <div>
          <Label>{t("pages.admin.homePage.demoServers.manage.name")}</Label>
          <Input
            value={mutableDemoServer.name}
            onChange={(e) =>
              setMutableDemoServer({
                ...mutableDemoServer,
                name: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>
            {t("pages.admin.homePage.demoServers.manage.description")}
          </Label>
          <Textarea
            value={mutableDemoServer.description}
            onChange={(e) =>
              setMutableDemoServer({
                ...mutableDemoServer,
                description: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>{t("pages.admin.homePage.demoServers.manage.icon")}</Label>
          <Input
            value={mutableDemoServer.icon ?? ""}
            onChange={(e) =>
              setMutableDemoServer({
                ...mutableDemoServer,
                icon: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>{t("pages.admin.homePage.demoServers.manage.priority")}</Label>
          <Input
            type="number"
            value={mutableDemoServer.priority}
            onChange={(e) =>
              setMutableDemoServer({
                ...mutableDemoServer,
                priority: parseInt(e.target.value, 10),
              })
            }
          />
        </div>
        <div>
          <Label>
            {t("pages.admin.homePage.demoServers.manage.channels.title")}
          </Label>
          {mutableDemoServer.channels.map((channel, index) => (
            <ChannelCard
              key={index}
              channel={channel}
              index={index}
              updateChannel={(index, updatedChannel) => {
                setMutableDemoServer({
                  ...mutableDemoServer,
                  channels: updateIn(
                    mutableDemoServer.channels,
                    updatedChannel,
                    index,
                  ),
                });
              }}
              removeChannel={(index) => {
                setMutableDemoServer({
                  ...mutableDemoServer,
                  channels: removeFrom(mutableDemoServer.channels, index),
                });
              }}
            />
          ))}
          <Button
            icon={PlusIcon}
            type="button"
            variant="secondary"
            onClick={() => {
              setMutableDemoServer({
                ...mutableDemoServer,
                channels: addTo(mutableDemoServer.channels, {
                  name: "",
                  type: 0,
                  topic: "",
                  showAsSkeleton: false,
                }),
              });
            }}
          >
            {t("pages.admin.homePage.demoServers.manage.channels.add")}
          </Button>
        </div>
        <div>
          <Label>
            {t("pages.admin.homePage.demoServers.manage.links.title")}
          </Label>
          {mutableDemoServer.links.map((link, index) => (
            <LinkCard
              key={index}
              link={link}
              index={index}
              updateLink={(index, updatedLink) => {
                setMutableDemoServer({
                  ...mutableDemoServer,
                  links: updateIn(mutableDemoServer.links, updatedLink, index),
                });
              }}
              removeLink={(index) => {
                setMutableDemoServer({
                  ...mutableDemoServer,
                  links: removeFrom(mutableDemoServer.links, index),
                });
              }}
            />
          ))}
          <Button
            icon={PlusIcon}
            type="button"
            variant="secondary"
            onClick={() => {
              setMutableDemoServer({
                ...mutableDemoServer,
                links: addTo(mutableDemoServer.links, { href: "", label: "" }),
              });
            }}
          >
            {t("pages.admin.homePage.demoServers.manage.links.add")}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <DeleteButton id={mutableDemoServer.id} />
        <Button
          icon={SaveIcon}
          type="submit"
          disabled={!isDirty || demoServerMutation.isPending}
        >
          {demoServerMutation.isSuccess && !isDirty
            ? t("pages.admin.homePage.demoServers.manage.saved")
            : t("pages.admin.homePage.demoServers.manage.save")}
        </Button>
      </CardFooter>
    </form>
  );
}
