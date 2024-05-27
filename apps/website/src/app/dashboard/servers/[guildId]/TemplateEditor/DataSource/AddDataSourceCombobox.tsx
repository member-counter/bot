import type { DataSourceId } from "@mc/common/DataSource";
import { useCallback, useMemo, useState } from "react";

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
import { dataSourcesMetadata } from "./dataSourcesMetadata";

export default function AddDataSourceCombobox({
  onAdd,
  children,
  disabled,
}: {
  onAdd: (dataSource: DataSourceId) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const isDesktop = useBreakpoint("md");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const items = useMemo(
    () => Object.values(dataSourcesMetadata).filter((item) => !item.hidden),
    [],
  );

  const filter = useCallback(
    (value: string, search: string, keywords: string[] | undefined) => {
      value = value.toLowerCase();
      search = search.toLowerCase();

      if (!keywords) return value.startsWith(search) ? 1 : 0;

      keywords = keywords.map((keyword) => keyword.toLowerCase());

      const score = keywords.reduce((acc, keyword) => {
        if (keyword.startsWith(search)) return acc + 1;
        return acc;
      }, 0);

      return score;
    },
    [],
  );

  const cmdRendered = useMemo(
    () => (
      <Command filter={filter} className={cn(!isDesktop && "rounded-xl")}>
        <CommandInput
          placeholder={"Search counter..."}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No counters found.</CommandEmpty>
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
                    className={cn(["flex flex-row gap-3 p-3"])}
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
    [filter, isDesktop, items, onAdd, search],
  );

  if (isDesktop) {
    return (
      <Popover open={!disabled && open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="mt-[-39px] p-0">
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
