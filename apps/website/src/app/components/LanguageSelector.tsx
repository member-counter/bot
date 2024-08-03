import { LanguagesIcon } from "lucide-react";

import { Button } from "@mc/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@mc/ui/dropdown-menu";

import { useTranslation } from "~/i18n/client";
import { languageEntries } from "~/i18n/settings";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  console.log(i18n);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <LanguagesIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(languageEntries).map(([code, label]) => (
          <DropdownMenuCheckboxItem
            key={code}
            checked={code === i18n.language}
            onCheckedChange={() => i18n.changeLanguage(code)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
