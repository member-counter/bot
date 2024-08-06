import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { AtSignIcon } from "lucide-react";
import { Editor, Range, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";

import { searchInTexts } from "@mc/common/searchInTexts";
import { cn } from "@mc/ui";
import { Portal } from "@mc/ui/portal";

import type { DashboardGuildParams } from "../../layout";
import type { GuildChannel, GuildRole } from "../d-types";
import { mentionColor } from "~/other/mentionColor";
import { api } from "~/trpc/react";
import { useChannelIcon } from "../../ChannelMaps";
import { insertMention } from "./insertMention";

enum SearchType {
  Role,
  Channel,
}

export function MentionSuggestions(props: {
  enabled: boolean;
  children: React.ReactNode;
}) {
  const { guildId } = useParams<DashboardGuildParams>();
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const { channels, roles } = api.discord.getGuild.useQuery({ id: guildId })
    .data ?? {
    channels: new Map<string, GuildChannel>(),
    roles: new Map<string, GuildRole>(),
  };
  const [range, setRange] = useState<Range | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Role);

  const suggestedItems: (GuildChannel | GuildRole)[] = useMemo(() => {
    const suggestableItems = [
      ...(searchType === SearchType.Role ? roles : channels).values(),
    ];

    const searchable: string[][] = suggestableItems.map((item) =>
      item.name.split(" "),
    );

    const ranking = searchInTexts(searchable, search);

    const rankedItems = ranking
      .slice(0, 10)
      .map((index) => suggestableItems[index])
      .filter(Boolean);

    return rankedItems;
  }, [search, searchType, roles, channels]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (range && suggestedItems.length > 0) {
        switch (event.key) {
          case "ArrowDown": {
            event.preventDefault();
            const prevIndex =
              selectedItemIndex >= suggestedItems.length - 1
                ? 0
                : selectedItemIndex + 1;
            setSelectedItemIndex(prevIndex);
            break;
          }
          case "ArrowUp": {
            event.preventDefault();
            const nextIndex =
              selectedItemIndex <= 0
                ? suggestedItems.length - 1
                : selectedItemIndex - 1;
            setSelectedItemIndex(nextIndex);
            break;
          }
          case "Tab":
          case "Enter": {
            event.preventDefault();
            Transforms.select(editor, range);
            const selectedItem = suggestedItems[selectedItemIndex];
            if (selectedItem) insertMention(editor, selectedItem);
            setRange(null);
            break;
          }
          case "Escape":
            event.preventDefault();
            setRange(null);
            break;
        }
      }
    },
    [suggestedItems, editor, selectedItemIndex, range],
  );

  useEffect(() => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: "word" });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMatch = beforeText?.match(/^[@#](\w+)$/);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (beforeMatch?.[1] && afterMatch && beforeRange) {
        setRange(beforeRange);
        setSearch(beforeMatch[1]);
        setSearchType(
          beforeMatch[0].startsWith("@") ? SearchType.Role : SearchType.Channel,
        );
        setSelectedItemIndex(0);
        return;
      } else {
        setRange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.selection]);

  useEffect(() => {
    const suggestionBox = suggestionBoxRef.current;

    if (!suggestionBox) return;

    suggestionBox.removeAttribute("style");

    if (range && suggestedItems.length > 0) {
      const domRange = ReactEditor.toDOMRange(editor, range);
      const rect = domRange.getBoundingClientRect();

      suggestionBox.style.opacity = "1";
      suggestionBox.style.top = `${rect.top + window.pageYOffset + 24}px`;
      suggestionBox.style.left = `${rect.left + window.pageXOffset}px`;
    }
  }, [suggestedItems.length, editor, selectedItemIndex, search, range]);

  if (!props.enabled) return <>{props.children}</>;
  return (
    <div onKeyDown={onKeyDown}>
      {props.children}
      <Portal>
        <div
          ref={suggestionBoxRef}
          className={
            "absolute left-[-10000px] top-[-10000px] z-50 m-1 flex flex-col gap-1 overflow-hidden rounded-md border bg-popover p-1 opacity-0 transition-opacity"
          }
        >
          {suggestedItems.map((item, index) => (
            <SuggestedItem
              key={item.name}
              isSelected={index === selectedItemIndex}
              item={item}
              onClick={() => {
                if (!range) return;
                Transforms.select(editor, range);
                insertMention(editor, item);
                setRange(null);
              }}
            />
          ))}
        </div>
      </Portal>
    </div>
  );
}

function SuggestedItem({
  item,
  onClick,
  isSelected,
}: {
  item: GuildRole | GuildChannel;
  onClick: () => void;
  isSelected: boolean;
}) {
  const isRole = "color" in item;
  const ChannelIcon = useChannelIcon(isRole ? "" : item.id);
  const Icon = isRole ? AtSignIcon : ChannelIcon;

  const style: React.CSSProperties = {};

  if (isRole) {
    const roleColors = mentionColor(item.color);
    style.color = roleColors.text;
  }

  return (
    <div
      onClick={onClick}
      className={cn([
        "flex cursor-pointer select-none flex-row items-center gap-1 rounded-sm p-1 px-2 hover:bg-accent",
        {
          "bg-accent": isSelected,
        },
      ])}
      style={style}
    >
      <Icon className={cn("mr-2 inline-block h-4 w-4", { "mr-0": isRole })} />
      {item.name}
    </div>
  );
}
