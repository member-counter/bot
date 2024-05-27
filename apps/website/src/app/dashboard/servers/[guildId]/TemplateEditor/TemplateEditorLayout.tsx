import { useMemo } from "react";
import { CurlyBracesIcon } from "lucide-react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { InputWrapper } from "@mc/ui/InputWrapper";
import { Separator } from "@mc/ui/separator";

import { EmojiPicker } from "./Emoji/EmojiPicker";
import { MarkButtons } from "./Marks/MarkButtons";
import { MentionSuggestions } from "./Mention/MentionSuggestions";
import { discordChannelNameWithDataSource } from "./serde/deserialization/grammar/sets/discordChannelNameWithDataSource";
import { discordChannelTopicWithDataSource } from "./serde/deserialization/grammar/sets/discordChannelTopicwithDataSource";
import { deserialize } from "./serde/deserialize";
import { serialize } from "./serde/serialize";
import TemplateEditor from "./TemplateEditor";
import TemplateEditorInput from "./TemplateEditorInput";

function InnerTemplateEditorLayout({
  id,
  className,
  disabled,
  target,
}: {
  id?: string;
  className?: string;
  disabled?: boolean;
  target: "channelName" | "channelTopic";
}) {
  const editor = useSlateStatic();

  return (
    <InputWrapper
      className={cn(
        "flex-col gap-2 px-2",
        {
          "h-auto min-h-40": target === "channelTopic",
          "h-20": target === "channelName",
        },
        className,
      )}
      onClick={() => {
        ReactEditor.focus(editor);
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2 [&_*]:rounded-sm">
          <MarkButtons
            buttonClassName={"h-6 w-6 px-0"}
            iconClassName="h-4 w-4"
          />
          <EmojiPicker className="h-6 w-6 px-0  py-0" />
        </div>
        <div className="flex flex-row gap-2 [&_*]:rounded-sm">
          <Button
            icon={CurlyBracesIcon}
            type="button"
            className="h-6 px-2 py-0 text-xs [&>svg]:mr-1"
          >
            Add counter
          </Button>
        </div>
      </div>
      <Separator />
      <MentionSuggestions enabled={target === "channelTopic"}>
        <TemplateEditorInput
          disabled={disabled}
          aria-labelledby={id}
          tabIndex={0}
          className={cn({
            "no-scrollbar flex-grow overflow-y-hidden overflow-x-scroll [&>*]:whitespace-pre":
              target === "channelName",
            "break-all": target === "channelTopic",
          })}
        />
      </MentionSuggestions>
    </InputWrapper>
  );
}

export default function TemplateEditorLayout({
  id,
  className,
  initiate,
  initialValue,
  onChange,
  disabled,
  target,
}: {
  id?: string;
  className?: string;
  initiate: boolean;
  initialValue: string;
  onChange: (digit: string) => void;
  disabled?: boolean;
  target: "channelName" | "channelTopic";
}) {
  const features =
    target === "channelName"
      ? discordChannelNameWithDataSource
      : discordChannelTopicWithDataSource;

  const deseriaizedValue = useMemo(
    () => (initiate ? deserialize(initialValue, features) : undefined),
    [initiate, initialValue, features],
  );

  if (!initiate) return null;

  return (
    <TemplateEditor
      textarea={target === "channelTopic"}
      features={features}
      initialValue={deseriaizedValue}
      onChange={(nodes, dataSourceRefs) => {
        const serialized = serialize(nodes, features, dataSourceRefs);
        onChange(serialized);
      }}
    >
      <InnerTemplateEditorLayout
        id={id}
        className={className}
        disabled={disabled}
        target={target}
      />
    </TemplateEditor>
  );
}
