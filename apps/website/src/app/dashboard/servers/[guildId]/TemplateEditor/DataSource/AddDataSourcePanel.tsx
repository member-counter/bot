import type { DataSourceId } from "@mc/common/DataSource";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { searchInTexts } from "@mc/common/searchInTexts";
import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { Card } from "@mc/ui/card";
import { Input } from "@mc/ui/input";

import type { DataSourceMetadata } from "./dataSourcesMetadata";
import { blurredBackground } from "~/other/common-styles";
import { dataSourcesMetadata } from "./dataSourcesMetadata";

export default function AddDataSourcePanel({
  onAdd,
  onClose,
}: {
  onAdd: (dataSource: DataSourceId) => void;
  onClose: () => void;
}): JSX.Element {
  const [suggestedItems, setSuggestedItems] = useState<DataSourceMetadata[]>(
    [],
  );
  const [search, setSearch] = useState("");
  const searchInputEl = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const searchableItems = [...Object.values(dataSourcesMetadata)].filter(
      (metadata) => !metadata.hidden,
    );

    if (!search.length) return setSuggestedItems(searchableItems);

    const ranking = searchInTexts(
      searchableItems.map((item) => item.keywords),
      search,
    );

    const rankedItems = ranking
      .map((index) => searchableItems[index])
      .filter(Boolean);

    setSuggestedItems(rankedItems);
  }, [search]);

  useEffect(() => searchInputEl.current?.focus(), []);

  const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter": {
        const selectedItem = suggestedItems[selectedIndex];
        if (!selectedItem) return;
        onAdd(selectedItem.dataSource.id);
        break;
      }
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
          if (newIndex >= suggestedItems.length)
            newIndex = suggestedItems.length - 1;
          setSelectedIndex(newIndex);
          event.preventDefault();
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div
        className={cn([
          blurredBackground,
          "sticky top-0 z-50 flex w-full flex-row gap-1 border-b border-border/40 p-1",
        ])}
      >
        <Input
          ref={searchInputEl}
          type="email"
          placeholder="Search counter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => setSelectedIndex(-1)}
          onKeyDown={onKeyDownHandler}
        />
        <Button
          variant="ghost"
          size="icon"
          className="flex-none"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-1 p-1">
        {suggestedItems.map(
          ({ icon: Icon, displayName, dataSource, description }, index) => (
            <Card
              // TODO reconsider using combobox or focus when selected
              key={dataSource.id}
              className={cn([
                "flex flex-row gap-3 p-3 hover:bg-foreground/10 focus:bg-foreground/10 focus:outline-none",
                { "bg-foreground/10": index === selectedIndex },
              ])}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                ["Enter", " "].includes(e.key) && onAdd(dataSource.id)
              }
              onClick={() => onAdd(dataSource.id)}
            >
              <Icon className="mt-[4px] h-5 w-5 flex-none" />
              <div>
                <h1 className="text-md font-semibold tracking-tight">
                  {displayName(dataSource)}
                </h1>
                <p className="text-sm">{description}</p>
              </div>
            </Card>
          ),
        )}
      </div>
    </div>
  );
}
