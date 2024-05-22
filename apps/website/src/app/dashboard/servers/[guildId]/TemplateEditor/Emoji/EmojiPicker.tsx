import { memo, useContext, useEffect, useMemo, useState } from "react";
import { SmileIcon } from "lucide-react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { searchInTexts } from "@mc/common/searchInTexts";
import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { Card } from "@mc/ui/card";
import { Drawer, DrawerContent, DrawerTrigger } from "@mc/ui/drawer";
import { Input } from "@mc/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@mc/ui/popover";
import { Separator } from "@mc/ui/separator";

import type { Searchable } from "../../../../../components/AutocompleteInput";
import type { EmojiElement } from "../custom-types";
import type { Guild, GuildEmoji } from "../d-types";
import { useBreakpoint } from "~/hooks/useBreakpoint";
import { removeFrom } from "~/other/array";
import { blurredBackground } from "~/other/common-styles";
import { emojis, emojisByGroup, searchableEmojis } from "~/other/emojis";
import { api } from "~/trpc/react";
import { GuildEmojiRenderer } from "../../../../../components/GuildEmojiRenderer";
import { TemplateEditorContext } from "../TemplateEditorContext";

export const EmojiPicker = memo(function EmojiPicker({
  className,
}: { className?: string } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useBreakpoint("md");
  const editor = useSlateStatic();
  const { features } = useContext(TemplateEditorContext);
  const [skinTone, setSkinTone] = useState("");
  const [search, setSearch] = useState("");
  const userGuildsQuery = api.discord.userGuilds.useQuery();
  const userGuilds = useMemo(
    () => [...(userGuildsQuery.data?.userGuilds.values() ?? [])],
    [userGuildsQuery.data],
  );
  const guildsQuery = api.useQueries((api) =>
    userGuilds.map((guild) => api.discord.getGuild({ id: guild.id })),
  );
  const guilds = useMemo(
    () => [...guildsQuery.map((guildQuery) => guildQuery.data).filter(Boolean)],
    [guildsQuery],
  );

  const guildEmojis = useMemo(
    () =>
      "emoji" in features
        ? [...guilds].flatMap((guild) => [...guild.emojis.values()])
        : [],
    [guilds, features],
  );

  const allSearchableEmojis: Searchable<string | GuildEmoji>[] = useMemo(
    () => [
      ...searchableEmojis,
      ...guildEmojis.map((emoji) => ({
        value: emoji,
        keywords: [emoji.name].filter(Boolean),
      })),
    ],
    [guildEmojis],
  );

  const matchingEmojis: (string | GuildEmoji)[] = useMemo(() => {
    const ranking = searchInTexts(
      allSearchableEmojis.map((emojis) => emojis.keywords),
      search,
    );

    const rankedItems = ranking
      .map((index) => allSearchableEmojis[index])
      .filter(Boolean);

    return rankedItems.map((item) => item.value);
  }, [allSearchableEmojis, search]);

  const onSelect = (emoji: string | GuildEmoji) => {
    const node: EmojiElement = {
      type: "emoji",
      emoji,
      children: [{ text: "" }],
    };
    editor.insertNode(node);
    ReactEditor.focus(editor);
  };

  const openButton = (
    <Button variant={"ghost"} className={cn(["h-10 px-3", className])}>
      <SmileIcon className="inline h-4 w-4" aria-label="Emoji picker" />
    </Button>
  );

  const emojiPicker = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={"flex h-[400px] flex-col md:w-[400px]"}
    >
      <div
        className={cn([
          blurredBackground,
          "fixed left-0 right-0 z-50 rounded-t-2xl border-b md:rounded-t-md md:border-x",
        ])}
      >
        <div className="flex flex-row gap-2 p-2">
          <Input
            className={blurredBackground}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emoji"
          />
          <SkinToneSelector value={skinTone} onChange={setSkinTone} />
        </div>
      </div>
      <div className="flex flex-grow flex-row">
        <EmojiList
          onSelect={(emoji) => {
            onSelect(emoji);
            setIsOpen(false);
          }}
          matchingEmojis={matchingEmojis}
          skinTone={skinTone}
          guilds={guilds}
        />
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>{openButton}</PopoverTrigger>
        <PopoverContent asChild className="p-0">
          {emojiPicker}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{openButton}</DrawerTrigger>
      <DrawerContent hideDragger className="rounded-t-2xl">
        {emojiPicker}
      </DrawerContent>
    </Drawer>
  );
});

function EmojiList({
  skinTone,
  onSelect,
  matchingEmojis,
  guilds,
}: {
  skinTone: string;
  onSelect: (emoji: string | GuildEmoji) => void;
  matchingEmojis: (string | GuildEmoji)[];
  guilds: Guild[];
}) {
  const groupedEmojis = useMemo(() => {
    const guildGroupedEmojis: [string, GuildEmoji[]][] = guilds.map((guild) => [
      guild.name,
      [...guild.emojis.values()],
    ]);

    const groupedEmojis: [string, (string | GuildEmoji)[]][] = [
      ...guildGroupedEmojis,
      ...Object.entries(emojisByGroup),
    ];

    return groupedEmojis;
  }, [guilds]);
  const [hoveredEmoji, setHoveredEmoji] = useState<string | GuildEmoji>("😁");

  const hoveredIsUnicodeEmoji = typeof hoveredEmoji === "string";
  const hoveredEmojiName = hoveredIsUnicodeEmoji
    ? emojis[hoveredEmoji]?.name
    : hoveredEmoji.name;

  const hoveredEmojiDisplay = hoveredIsUnicodeEmoji ? (
    emojis[hoveredEmoji]?.skin_tone_support ? (
      hoveredEmoji + skinTone
    ) : (
      hoveredEmoji
    )
  ) : (
    <GuildEmojiRenderer emoji={hoveredEmoji} />
  );

  return (
    <div className={"flex h-full w-full flex-col"}>
      <div className="relative h-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col gap-5 overflow-auto p-3  pt-[70px]">
          {groupedEmojis.map(([groupName, groupEmojis]) => {
            const hidden = !groupEmojis.some((emoji) =>
              matchingEmojis.includes(emoji),
            );
            return (
              <div key={groupName} className={cn({ hidden })}>
                <div className="text-sm font-medium">{groupName}</div>
                <div className="flex flex-row flex-wrap place-content-between">
                  {groupEmojis.map((emoji, i) => {
                    const isMatching = !matchingEmojis.includes(emoji);

                    const skined =
                      typeof emoji === "string" &&
                      emojis[emoji]?.skin_tone_support
                        ? emoji + skinTone
                        : emoji;

                    return (
                      <div
                        key={i}
                        role="button"
                        className={cn({
                          "flex h-[40px] min-w-[40px] select-none items-center justify-center overflow-hidden rounded-md text-[25px] hover:bg-accent":
                            true,
                          hidden: isMatching,
                        })}
                        tabIndex={0}
                        onKeyDown={(e) =>
                          ["Enter", " "].includes(e.key) && onSelect(skined)
                        }
                        onClick={() => onSelect(skined)}
                        onMouseEnter={() => setHoveredEmoji(emoji)}
                      >
                        {typeof skined === "string" ? (
                          skined
                        ) : (
                          <GuildEmojiRenderer
                            className="w-[30px]"
                            emoji={skined}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="hidden min-h-[64px] flex-row items-center gap-2 border-t border-border p-4 md:flex">
        <div className="text-2xl">{hoveredEmojiDisplay}</div>
        <div className="text-md font-medium capitalize">{hoveredEmojiName}</div>
      </div>
    </div>
  );
}

function SkinToneSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const availableSkinTones = ["", "🏻", "🏼", "🏽", "🏾", "🏿"];
  const skinTonesToRender = [
    value,
    ...removeFrom(
      availableSkinTones,
      availableSkinTones.findIndex((item) => value === item),
    ),
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [value]);

  return (
    <div
      className="z-[5000] w-[50px]"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="fixed">
        <div
          role="button"
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => ["Enter", " "].includes(e.key) && setIsOpen(true)}
          tabIndex={isOpen ? -1 : 0}
          className={cn([
            {
              "h-[40px]": !isOpen,
            },
            "select-none overflow-hidden rounded-md border border-border",
            blurredBackground,
          ])}
        >
          {skinTonesToRender.map((skinTone) => {
            return (
              <div
                key={skinTone}
                role="button"
                className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center text-[25px] outline-none focus-within:bg-accent/60 hover:bg-accent/60"
                onClick={() => onChange(skinTone)}
                onKeyDown={(e) =>
                  ["Enter", " "].includes(e.key) && onChange(skinTone)
                }
                tabIndex={isOpen ? 1 : -1}
              >
                <div>{`👏${skinTone}`}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
