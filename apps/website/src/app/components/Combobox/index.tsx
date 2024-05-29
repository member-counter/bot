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

export interface Searchable<T> {
  value: T;
  keywords: string[];
}

export interface ComboboxProps<
  RequestedType,
  AllowSearchedTerm extends boolean = false,
  ActualType = AllowSearchedTerm extends true
    ? string | RequestedType
    : RequestedType,
> {
  id?: string;
  className?: string;
  placeholder?: string;
  items: Searchable<RequestedType>[];
  allowSearchedTerm?: AllowSearchedTerm;
  selectedItem?: ActualType;
  onItemSelect: (item: ActualType) => void;
  onSelectedItemRender?: (props: { item: ActualType }) => ReactNode;
  onItemRender: (props: {
    item: ActualType;
    isSelected?: boolean;
  }) => ReactNode;
  disabled?: boolean;
}

export function Combobox<T, A extends boolean = false>({
  id,
  className,
  placeholder = "Add...",
  allowSearchedTerm,
  items,
  selectedItem,
  onSelectedItemRender,
  onItemRender,
  onItemSelect,
  disabled,
}: ComboboxProps<T, A>) {
  const [open, setOpen] = useState(false);
  const isDesktop = useBreakpoint("md");
  const [search, setSearch] = useState("");

  const filter = useCallback(
    (value: string, search: string, keywords: string[] | undefined) => {
      value = value.toLowerCase();
      search = search.toLowerCase();

      if (
        allowSearchedTerm &&
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
    [allowSearchedTerm],
  );

  const selectedItemRendered = useMemo(
    () => (
      <InputWrapper
        className={cn("justify-start px-3", "text-muted-foreground", className)}
        role="button"
        id={id}
        onClick={() => !disabled && setOpen(true)}
        onKeyDown={(e) =>
          ["Enter", " "].includes(e.key) && !disabled && setOpen(true)
        }
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        disabled={disabled}
      >
        {selectedItem && onSelectedItemRender ? (
          onSelectedItemRender({
            item: selectedItem,
          })
        ) : (
          <div className="flex items-center">
            <SearchIcon className="mr-2 h-4 w-4" />
            {placeholder}
          </div>
        )}
      </InputWrapper>
    ),
    [className, disabled, id, onSelectedItemRender, placeholder, selectedItem],
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
            {items.map(({ value, keywords }, i) => {
              return (
                <CommandItem
                  className={cn(selectedItem === value && "bg-accent")}
                  key={i}
                  keywords={keywords}
                  onSelect={() => {
                    onItemSelect(structuredClone(value));
                    setOpen(false);
                  }}
                >
                  {onItemRender({
                    item: value,
                    isSelected: selectedItem === value,
                  })}
                </CommandItem>
              );
            })}
            {allowSearchedTerm && (
              <>
                {!!search.length && allowSearchedTerm && (
                  <CommandItem
                    className={cn(selectedItem === search && "bg-accent")}
                    key={searchId}
                    onSelect={() => {
                      onItemSelect(
                        structuredClone(
                          search as A extends true ? T | string : T,
                        ),
                      );
                      setOpen(false);
                    }}
                  >
                    {onItemRender({
                      item: search as A extends true ? T | string : T,
                      isSelected: selectedItem === search,
                    })}
                  </CommandItem>
                )}
                {selectedItem && selectedItem !== search && (
                  <CommandItem
                    className={cn("bg-accent")}
                    key={selfId}
                    onSelect={() => {
                      onItemSelect(structuredClone(selectedItem));
                      setOpen(false);
                    }}
                  >
                    {onItemRender({
                      item: selectedItem,
                      isSelected: true,
                    })}
                  </CommandItem>
                )}
              </>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    [
      allowSearchedTerm,
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
      <Popover open={!disabled && open} onOpenChange={setOpen}>
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
    <Drawer open={!disabled && open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{selectedItemRendered}</DrawerTrigger>
      <DrawerContent className="bg-popover">{cmdRendered}</DrawerContent>
    </Drawer>
  );
}
