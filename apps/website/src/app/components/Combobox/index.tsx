import type { ReactNode } from "react";
import { useCallback, useId, useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
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
  prefillSelectedItemOnSearchOnFocus?: boolean;
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
  placeholder,
  prefillSelectedItemOnSearchOnFocus,
  allowSearchedTerm,
  items,
  selectedItem,
  onSelectedItemRender,
  onItemRender,
  onItemSelect: fireOnItemSelect,
  disabled,
}: ComboboxProps<T, A>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const isDesktop = useBreakpoint("md");
  const [search, setSearch] = useState("");

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
          <div className="flex items-center overflow-hidden text-ellipsis whitespace-nowrap ">
            {!!placeholder?.length && (
              <SearchIcon className="mr-2 h-4 w-4 min-w-4" />
            )}
            {placeholder ?? t("components.Combobox.placeholder")}
          </div>
        )}
      </InputWrapper>
    ),
    [
      className,
      disabled,
      id,
      onSelectedItemRender,
      placeholder,
      selectedItem,
      t,
    ],
  );

  const onItemSelect = useCallback(
    (value: string | T) => {
      fireOnItemSelect(structuredClone(value as never));
      setOpen(false);
      setSearch("");
    },
    [fireOnItemSelect],
  );

  const selfId = useId();
  const searchId = useId();

  const cmdRendered = useMemo(
    () => (
      <Command className={cn(!isDesktop && "rounded-xl")}>
        <CommandInput
          placeholder={
            placeholder ?? t("components.Combobox.searchPlaceholder")
          }
          value={search}
          onValueChange={setSearch}
          onFocus={(e) => {
            if (!prefillSelectedItemOnSearchOnFocus) return;
            if (typeof selectedItem !== "string") return;
            setSearch(selectedItem);
            e.target.selectionStart = 0;
            e.target.selectionEnd = selectedItem.length;
          }}
        />
        <CommandList>
          <CommandEmpty>{t("components.Combobox.noResults")}</CommandEmpty>
          <CommandGroup>
            {items.map(({ value, keywords }, i) => {
              return (
                <CommandItem
                  value={JSON.stringify(value)}
                  className={cn(selectedItem === value && "bg-accent")}
                  key={i}
                  keywords={keywords}
                  onSelect={() => onItemSelect(value)}
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
                    value={search}
                    className={cn(selectedItem === search && "bg-accent")}
                    key={searchId}
                    onSelect={onItemSelect}
                  >
                    {onItemRender({
                      item: search as never,
                      isSelected: selectedItem === search,
                    })}
                  </CommandItem>
                )}
                {selectedItem && selectedItem !== search && (
                  <CommandItem
                    className={cn("bg-accent")}
                    key={selfId}
                    onSelect={onItemSelect}
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
      isDesktop,
      items,
      onItemRender,
      onItemSelect,
      placeholder,
      prefillSelectedItemOnSearchOnFocus,
      search,
      searchId,
      selectedItem,
      selfId,
      t,
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
