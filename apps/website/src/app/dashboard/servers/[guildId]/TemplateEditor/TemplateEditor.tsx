/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { Descendant } from "slate";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { CurlyBracesIcon, EditIcon, ScanEyeIcon } from "lucide-react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { InputWrapper } from "@mc/ui/InputWrapper";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildChannelParams } from "../[channelId]/layout";
import type { DataSourceRefs } from "./utils";
import { useDebounce } from "~/hooks/useDebounce";
import { api } from "~/trpc/react";
import AddDataSourceCombobox from "./DataSource/AddDataSourceCombobox";
import EditDataSource from "./DataSource/EditDataSource";
import { DisplayTemplateError } from "./DisplayTemplateError";
import { EmojiPicker } from "./Emoji/EmojiPicker";
import { MarkButtons } from "./Marks/MarkButtons";
import { MentionSuggestions } from "./Mention/MentionSuggestions";
import { discordChannelNameWithDataSource } from "./serde/deserialization/grammar/sets/discordChannelNameWithDataSource";
import { discordChannelTopicWithDataSource } from "./serde/deserialization/grammar/sets/discordChannelTopicwithDataSource";
import { deserialize } from "./serde/deserialize";
import { serialize } from "./serde/serialize";
import SlateTemplateEditor from "./SlateTemplateEditor";
import SlateTemplateEditorInput from "./SlateTemplateEditorInput";

type TemplateTarget = "channelName" | "channelTopic";

function TemplateEditorInputLayout({
  id,
  className,
  disabled,
  target,
  showPreview,
  togglePreview,
}: {
  id?: string;
  className?: string;
  disabled?: boolean;
  target: TemplateTarget;
  showPreview?: boolean;
  togglePreview: () => void;
}) {
  const editor = useSlateStatic();

  return (
    <InputWrapper
      className={cn(
        "flex-col gap-2 px-2",
        {
          "h-auto min-h-40": target === "channelTopic",
          "h-[82px]": target === "channelName",
        },
        className,
      )}
      onClick={(e) => {
        if (disabled) return e.preventDefault();
        ReactEditor.focus(editor);
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 [&_*]:rounded-sm">
          <MarkButtons
            disabled={disabled || showPreview}
            buttonClassName={"h-6 w-6 px-0"}
            iconClassName="h-4 w-4"
          />
          <EmojiPicker
            disabled={disabled || showPreview}
            className="h-6 w-6 px-0 py-0"
          />
        </div>
        <div className="flex flex-row gap-2 [&_*]:rounded-sm">
          <Button
            icon={showPreview ? EditIcon : ScanEyeIcon}
            type="button"
            variant="ghost"
            size="xs"
            disabled={disabled}
            onClick={togglePreview}
          >
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <AddDataSourceCombobox disabled={showPreview || disabled}>
            <Button
              icon={CurlyBracesIcon}
              type="button"
              size="xs"
              disabled={disabled || showPreview}
            >
              Add counter
            </Button>
          </AddDataSourceCombobox>
        </div>
      </div>
      <Separator />
      <MentionSuggestions enabled={target === "channelTopic"}>
        <SlateTemplateEditorInput
          readOnly={disabled || showPreview}
          aria-labelledby={id}
          tabIndex={0}
          className={cn({
            "no-scrollbar flex-grow overflow-hidden px-[1px] [&>*]:whitespace-pre":
              target === "channelName",
            "break-all": target === "channelTopic",
          })}
        />
      </MentionSuggestions>
      <div
        /**
         * Prevent the editor from being focused when clicking anywhere
         * in the EditDataSource panel
         * (it's actually being mounted somewhere else in the app)
         */
        className="hidden"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <EditDataSource />
      </div>
    </InputWrapper>
  );
}

export default function TemplateEditor({
  id,
  className,
  initiate,
  value,
  onChange,
  disabled,
  target,
}: {
  id?: string;
  className?: string;
  initiate: boolean;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  target: TemplateTarget;
}) {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();

  const [showPreview, setShowPreview] = useState(false);
  const togglePreview = useCallback(
    () => setShowPreview(!showPreview),
    [showPreview],
  );

  const features =
    target === "channelName"
      ? discordChannelNameWithDataSource
      : discordChannelTopicWithDataSource;

  const onChangeCallback = useCallback(
    (nodes: Descendant[], dataSourceRefs: DataSourceRefs) => {
      const serialized = serialize(nodes, features, dataSourceRefs);

      if (serialized !== value) {
        onChange(serialized);
      }
    },
    [features, onChange, value],
  );

  const deseriaizedValue = useMemo(
    () => deserialize(value, features),
    [value, features],
  );

  const debouncedValue = useDebounce(value, 1_000);
  const computedValue = api.bot.computeTemplate.useQuery({
    guildId,
    channelId,
    template: debouncedValue,
  });
  const computedDeserializedValue = useMemo(
    () => deserialize(computedValue.data ?? "", features),
    [computedValue.data, features],
  );

  const editor = useMemo(() => {
    if (!initiate) return null;
    return (
      <SlateTemplateEditor
        disabled={disabled}
        textarea={target === "channelTopic"}
        features={features}
        initialValue={deseriaizedValue}
        onChange={onChangeCallback}
      >
        <TemplateEditorInputLayout
          id={id}
          className={className}
          disabled={disabled}
          target={target}
          showPreview={showPreview}
          togglePreview={togglePreview}
        />
      </SlateTemplateEditor>
    );
  }, [
    className,
    deseriaizedValue,
    disabled,
    features,
    id,
    initiate,
    onChangeCallback,
    showPreview,
    target,
    togglePreview,
  ]);

  const preview = useMemo(() => {
    return (
      <>
        <SlateTemplateEditor
          key={computedValue.data}
          disabled={disabled}
          textarea={target === "channelTopic"}
          features={features}
          initialValue={computedDeserializedValue}
        >
          <TemplateEditorInputLayout
            id={id}
            className={className}
            target={target}
            showPreview={showPreview}
            togglePreview={togglePreview}
          />
        </SlateTemplateEditor>
        {computedValue.error && (
          <DisplayTemplateError message={computedValue.error.message} />
        )}
      </>
    );
  }, [
    className,
    computedDeserializedValue,
    computedValue.data,
    computedValue.error,
    disabled,
    features,
    id,
    showPreview,
    target,
    togglePreview,
  ]);

  return showPreview ? preview : editor;
}
