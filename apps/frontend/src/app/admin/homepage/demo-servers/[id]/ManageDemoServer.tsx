import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DemoServerFeature,
  DemoServerPremiumTier,
} from "@mc/common/DemoServer";
import { Button } from "@mc/ui/button";
import { Form } from "@mc/ui/form";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { MultiSelect } from "@mc/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { Textarea } from "@mc/ui/textarea";

import { FormManagerProvider, SaveButton } from "~/app/components/FormManager";
import { addTo, removeFrom, updateIn } from "~/lib/array";
import { useFormManager } from "~/lib/hooks/useFormManager";
import { usePrefersAutosave } from "~/lib/hooks/usePrefersAutosave";
import { languageEntries } from "~/lib/i18n/index";
import { api } from "~/lib/trpc";
import { ChannelCard } from "./ChannelCard";
import { DeleteButton } from "./DeleteButton";
import { LinkCard } from "./LinkCard";

export default function ManageDemoServer({ id }: { id: string }) {
  const { t } = useTranslation();
  const prefersAutosave = usePrefersAutosave();
  const form = useFormManager(
    api.demoServers.get.useQuery({ id }),
    api.demoServers.update.useMutation(),
    id,
    prefersAutosave,
  );
  const {
    value: mutableDemoServer,
    setValue: setMutableDemoServer,
    save: saveDemoServer,
  } = form;

  if (!mutableDemoServer) return null;

  return (
    <FormManagerProvider value={form}>
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
          {t("pages.admin.homePage.demoServers.manage.premiumTier.title")}
          <Select
            value={mutableDemoServer.premiumTier}
            onValueChange={(premiumTier: DemoServerPremiumTier) =>
              setMutableDemoServer({
                ...mutableDemoServer,
                premiumTier,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(DemoServerPremiumTier).map((premiumTier) => (
                  <SelectItem key={premiumTier} value={premiumTier}>
                    {t(
                      `pages.admin.homePage.demoServers.manage.premiumTier.options.${premiumTier}`,
                    )}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Label>

        <Label>
          {t("pages.admin.homePage.demoServers.manage.features.title")}
          <MultiSelect
            options={Object.values(DemoServerFeature).map((feature) => ({
              value: feature,
              label: t(
                `pages.admin.homePage.demoServers.manage.features.options.${feature}`,
              ),
            }))}
            onValueChange={(features: string[]) =>
              setMutableDemoServer({
                ...mutableDemoServer,
                features: features as DemoServerFeature[],
              })
            }
            defaultValue={mutableDemoServer.features}
            responsive={true}
            searchable={false}
            hideSelectAll={true}
            placeholder=""
          />
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
                  isRulesChannel: false,
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
          <SaveButton />
        </div>
      </Form>
    </FormManagerProvider>
  );
}
