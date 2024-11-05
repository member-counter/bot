import { TrashIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@mc/ui/button";
import { Card } from "@mc/ui/card";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";

import type { DemoServerData } from "../../../../../../../../packages/services/src/demoServers";

interface LinkCardProps {
  link: DemoServerData["links"][number];
  index: number;
  updateLink: (index: number, link: DemoServerData["links"][number]) => void;
  removeLink: (index: number) => void;
}

export function LinkCard({
  link,
  index,
  updateLink,
  removeLink,
}: LinkCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col gap-4 bg-secondary p-4 [&>*]:flex [&>*]:flex-col [&>*]:gap-2">
      <div>
        <Label>
          {t("pages.admin.homePage.demoServers.manage.links.link.label")}
        </Label>
        <Input
          value={link.label}
          onChange={(e) =>
            updateLink(index, { ...link, label: e.target.value })
          }
        />
      </div>
      <div>
        <Label>
          {t("pages.admin.homePage.demoServers.manage.links.link.url")}
        </Label>
        <Input
          value={link.href}
          onChange={(e) => updateLink(index, { ...link, href: e.target.value })}
        />
      </div>
      <div>
        <Button
          icon={TrashIcon}
          variant="destructive"
          type="button"
          onClick={() => removeLink(index)}
        >
          {t("pages.admin.homePage.demoServers.manage.links.link.remove")}
        </Button>
      </div>
    </Card>
  );
}
