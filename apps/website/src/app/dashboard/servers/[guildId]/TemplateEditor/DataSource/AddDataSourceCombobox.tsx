import type { DataSourceId } from "@mc/common/DataSource";
import { useCallback, useMemo, useState } from "react";
import { useSlateStatic } from "slate-react";
import { useTranslation } from "react-i18next";

import { cn } from "@mc/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@mc/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@mc/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@mc/ui/popover";

import { useBreakpoint } from "~/hooks/useBreakpoint";
import { useDataSourceRefs } from "./DataSourceRefs";
import { dataSourcesMetadata } from "./dataSourcesMetadata";
import { insertDataSource } from "./insertDataSource";

export default function AddDataSourceCombobox({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const editor = useSlateStatic();
  const { setDataSourceRef } = useDataSourceRefs();
  const isDesktop = useBreakpoint("md");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const items = useMemo(
    () => Object.values(dataSourcesMetadata).filter((item) => !item.hidden),
    [],
  );

  const onAdd = useCallback(
    (id: DataSourceId) => {
      insertDataSource(editor, id, setDataSourceRef);
    },
    [editor, setDataSourceRef],
  );

  const cmdRendered = useMemo(
    () => (
      <Command className={cn(!isDesktop && "rounded-xl")}>
        <CommandInput
          placeholder={t('pages.dashboard.servers.TemplateEditor.AddDataSourceCombobox.searchPlaceholder')}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>{t('pages.dashboard.servers.TemplateEditor.AddDataSourceCombobox.noItemsFound')}</CommandEmpty>
          <CommandGroup>
            {items.map((item) => {
              return (
                <CommandItem
                  key={item.dataSource.id}
                  value={item.dataSource.id.toString()}
                  keywords={item.keywords}
                  onSelect={() => {
                    onAdd(item.dataSource.id);
                    setOpen(false);
                  }}
                >
                  <div
                    key={item.dataSource.id}
                    className={cn(["flex flex-row gap-3 p-1"])}
                  >
                    <item.icon className="mt-[4px] h-5 w-5 flex-none" />
                    <div>
                      <h1 className="text-md font-semibold tracking-tight">
                        {item.displayName(item.dataSource)}
                      </h1>
                      <p className="text-sm">{item.description}</p>
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    [isDesktop, items, onAdd, search, t],
  );

  if (isDesktop) {
    return (
      <Popover open={!disabled && open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="mt-[-39px] w-[400px] p-0">
          {cmdRendered}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={!disabled && open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-popover">{cmdRendered}</DrawerContent>
    </Drawer>
  );
}
