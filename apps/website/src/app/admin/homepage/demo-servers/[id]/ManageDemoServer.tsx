import { PlusIcon, SaveIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Form } from "@mc/ui/form";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { Textarea } from "@mc/ui/textarea";

import { FormManagerState, useFormManager } from "~/hooks/useFormManager";
import { languageEntries } from "~/i18n/settings";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import { ChannelCard } from "./ChannelCard";
import { DeleteButton } from "./DeleteButton";
import { LinkCard } from "./LinkCard";

export default function ManageDemoServer({ id }: { id: string }) {
  const { t } = useTranslation();
  const [
    _demoServer,
    mutableDemoServer,
    setMutableDemoServer,
    saveDemoServer,
    formState,
  ] = useFormManager(
    api.demoServers.get.useQuery({ id }),
    api.demoServers.update.useMutation(),
  );

  if (!mutableDemoServer) return null;

  return (
    <Form onSubmit={() => void saveDemoServer()}>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.name")}
        <Input
          value={mutableDemoServer.name}
          onChange={(e) =>
            setMutableDemoServer({
              ...mutableDemoServer,
              name: e.target.value,
            })
          }
        />{" "}
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.description")}
        <Textarea
          value={mutableDemoServer.description}
          onChange={(e) =>
            setMutableDemoServer({
              ...mutableDemoServer,
              description: e.target.value,
            })
          }
        />
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.icon")}
        <Input
          value={mutableDemoServer.icon ?? ""}
          onChange={(e) =>
            setMutableDemoServer({
              ...mutableDemoServer,
              icon: e.target.value,
            })
          }
        />
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.priority")}
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
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.language")}
        <Select
          value={mutableDemoServer.language}
          onValueChange={(language) =>
            setMutableDemoServer({
              ...mutableDemoServer,
              language,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(languageEntries).map(([code, label]) => (
                <SelectItem key={code} value={code}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.channels.title")}
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
      </Label>
      <Label>
        {t("pages.admin.homePage.demoServers.manage.links.title")}
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
      </Label>
      <div className="flex flex-row justify-between">
        <DeleteButton id={mutableDemoServer.id} />
        <Button
          icon={SaveIcon}
          type="submit"
          disabled={[FormManagerState.SAVED, FormManagerState.SAVING].includes(
            formState,
          )}
        >
          {formState === FormManagerState.SAVED
            ? t("hooks.useFormManager.state.saved")
            : formState === FormManagerState.SAVING
              ? t("hooks.useFormManager.state.saving")
              : t("hooks.useFormManager.state.save")}
        </Button>
      </div>
    </Form>
  );
}
