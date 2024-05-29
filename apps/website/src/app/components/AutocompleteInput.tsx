import type { KeyboardEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";

import { searchInTexts } from "@mc/common/searchInTexts";
import { Input } from "@mc/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@mc/ui/popover";

export interface Searchable<T> {
  value: T;
  keywords: string[];
}

interface AutocompleteInputProps<T> {
  allowSearchedItem?: boolean;
  onAdd: (item: T | string) => void;
  itemRenderer: (
    item: T | string,
    index: number,
    isSelected: boolean,
    onClick: () => void,
  ) => ReactNode;
  suggestableItems?: Searchable<T | string>[];
  placeholder?: string;
  suggestLimit?: number;
  suggestOnFocus?: boolean;
}

export default function Combobox<T>({
  suggestableItems = [],
  placeholder = "Add...",
  suggestLimit = 5,
  suggestOnFocus = true,
  allowSearchedItem = false,
  itemRenderer,
  onAdd,
}: AutocompleteInputProps<T>) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [showUnsetWarning, setShowUnsetWarning] = useState(false);
  const [popoverMouseEnter, setPopoverMouseEnter] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const filteredSuggestedItems = useMemo(() => {
    const searchable: string[][] = suggestableItems.map(
      (item) => item.keywords,
    );

    const ranking = searchInTexts(searchable, search);

    const rankedItems = ranking
      .slice(0, suggestLimit)
      .map((index) => suggestableItems[index])
      .filter(Boolean);

    if (search.length) {
      setShowPopover(true);
    }

    if (allowSearchedItem && search.length) {
      rankedItems.unshift({ value: search, keywords: [] });
    }

    return rankedItems.map((item) => item.value);
  }, [allowSearchedItem, search, suggestLimit, suggestableItems]);

  const add = (index: number): void => {
    const selectedItem = filteredSuggestedItems[index];
    if (!selectedItem) return;

    onAdd(selectedItem);
    setSearch("");
    setPopoverMouseEnter(false);
    setSelectedIndex(0);
    setShowPopover(false);
    setShowUnsetWarning(false);
  };

  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        add(selectedIndex);
        break;
      case "ArrowUp":
        {
          let newIndex = selectedIndex - 1;
          if (newIndex < 0) newIndex = 0;
          setSelectedIndex(newIndex);
          event.preventDefault();
        }
        break;
      case "ArrowDown":
        {
          let newIndex = selectedIndex + 1;
          if (newIndex >= filteredSuggestedItems.length)
            newIndex = filteredSuggestedItems.length - 1;
          setSelectedIndex(newIndex);
          event.preventDefault();
        }
        break;

      default:
        break;
    }
  };

  return (
    <Popover open={showPopover} onOpenChange={setShowPopover}>
      <PopoverAnchor>
        <>
          <Input
            ref={inputRef}
            placeholder={placeholder}
            onKeyDown={onKeyDownHandler}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              setShowPopover(suggestOnFocus || !!search.length);
              setShowUnsetWarning(false);
            }}
            onBlur={() => {
              !popoverMouseEnter && setShowPopover(false);
              !popoverMouseEnter && setShowUnsetWarning(!!search.length);
            }}
          />

          {showUnsetWarning && (
            <div className="mt-1 text-xs text-destructive">
              This selection isn't saved
            </div>
          )}
        </>
      </PopoverAnchor>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onFocusOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        style={{ width: "calc(var(--radix-popover-trigger-width) + 5px)" }}
        className="mt-1 flex flex-col gap-1 p-1"
        onMouseEnter={() => setPopoverMouseEnter(true)}
        onMouseLeave={() => setPopoverMouseEnter(false)}
      >
        {filteredSuggestedItems.map((item, i) =>
          itemRenderer(item, i, i === selectedIndex, () => add(i)),
        )}
        {!filteredSuggestedItems.length && (
          <p className="p-2 text-center text-sm text-muted-foreground">
            Nothing found
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
