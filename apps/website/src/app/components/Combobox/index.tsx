"use client";

import type { ReactNode } from "react";
import { useCallback, useId, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

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
import { InputWrapper } from "@mc/ui/InputWrapper";
import { Popover, PopoverContent, PopoverTrigger } from "@mc/ui/popover";

import { useBreakpoint } from "~/hooks/useBreakpoint";

export interface Searchable {
  value: string;
  keywords: string[];
}

export type ComboboxProps = {
  className?: string;
  placeholder?: string;
  items: Searchable[];
  allowSearchedItem?: boolean;
  onItemRender: (item: string, isSelected: boolean) => ReactNode;
  onSelectedItemRender: (args: {
    item: string;
    onRemoveRequest?: () => void;
  }) => ReactNode;
} & (
  | {
      allowEmpty: true;
      selectedItem: string | null;
      onItemSelect: (item: string | null) => void;
    }
  | {
      allowEmpty?: false;
      selectedItem: string;
      onItemSelect: (item: string) => void;
    }
);

export function Combobox({
  className,
  placeholder = "Add...",
  allowSearchedItem = false,
  allowEmpty,
  items,
  selectedItem,
  onItemSelect,
  onItemRender,
  onSelectedItemRender,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useBreakpoint("md");
  const [search, setSearch] = useState("");

  const filter = useCallback(
    (value: string, search: string, keywords: string[] | undefined) => {
      value = value.toLowerCase();
      search = search.toLowerCase();

      if (
        allowSearchedItem &&
        !keywords?.length &&
        search.length &&
        value.startsWith(search)
      )
        return Number.MAX_VALUE;

      if (!keywords) return value.startsWith(search) ? 1 : 0;

      keywords = keywords.map((keyword) => keyword.toLowerCase());

      const score = keywords.reduce((acc, keyword) => {
        if (keyword.startsWith(search)) return acc + 1;
        return acc;
      }, 0);

      return score;
    },
    [allowSearchedItem],
  );

  const selectedItemRendered = useMemo(
    () => (
      <InputWrapper
        className={cn("justify-start px-3", "text-muted-foreground", className)}
        role="combobox"
      >
        {selectedItem ? (
          onSelectedItemRender({
            item: selectedItem,
            ...(allowEmpty && { onRemoveRequest: () => onItemSelect(null) }),
          })
        ) : (
          <div className="flex items-center">
            <SearchIcon className="mr-2 h-4 w-4" />
            {placeholder}
          </div>
        )}
      </InputWrapper>
    ),
    [
      className,
      selectedItem,
      onSelectedItemRender,
      allowEmpty,
      placeholder,
      onItemSelect,
    ],
  );

  const selfId = useId();
  const searchId = useId();

  const cmdRendered = useMemo(
    () => (
      <Command filter={filter} className={cn(!isDesktop && "rounded-xl")}>
        <CommandInput
          placeholder={placeholder}
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {items.map(({ value, keywords }) => {
              return (
                <CommandItem
                  key={value}
                  value={value}
                  keywords={keywords}
                  onSelect={() => {
                    onItemSelect(value);
                    setOpen(false);
                  }}
                >
                  {onItemRender(value, selectedItem === value)}
                </CommandItem>
              );
            })}
            {allowSearchedItem && (
              <>
                {!!search.length && (
                  <CommandItem
                    key={searchId}
                    value={search}
                    onSelect={() => {
                      onItemSelect(search);
                      setOpen(false);
                    }}
                  >
                    {onItemRender(search, selectedItem === search)}
                  </CommandItem>
                )}
                {selectedItem && selectedItem !== search && (
                  <CommandItem
                    key={selfId}
                    value={selectedItem}
                    onSelect={() => {
                      onItemSelect(selectedItem);
                      setOpen(false);
                    }}
                  >
                    {onItemRender(selectedItem, true)}
                  </CommandItem>
                )}
              </>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    [
      allowSearchedItem,
      filter,
      isDesktop,
      items,
      onItemRender,
      onItemSelect,
      placeholder,
      search,
      searchId,
      selectedItem,
      selfId,
    ],
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{selectedItemRendered}</PopoverTrigger>
        <PopoverContent
          className="mt-[-48px] p-0"
          style={{ width: "calc(var(--radix-popover-trigger-width) + 8px)" }}
        >
          {cmdRendered}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{selectedItemRendered}</DrawerTrigger>
      <DrawerContent className="bg-popover">{cmdRendered}</DrawerContent>
    </Drawer>
  );
}
