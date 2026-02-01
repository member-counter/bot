import { useMemo } from "react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { InputWrapper } from "@mc/ui/InputWrapper";

import { EmojiPicker } from "../../Emoji/EmojiPicker";
import { HoveringToolbar } from "../../Marks/HoveringToolbar";
import { discordChannelTopic } from "../../serde/deserialization/grammar/sets/discordChannelTopic";
import { deserialize } from "../../serde/deserialize";
import { serialize } from "../../serde/serialize";
import SlateTemplateEditor from "../../SlateTemplateEditor";
import SlateTemplateEditorInput from "../../SlateTemplateEditorInput";

const features = discordChannelTopic;

function DataSourceFormatDigitInputInner({
  className,
  digitNumber,
  disabled,
}: {
  digitNumber: number;
  className?: string;
  disabled?: boolean;
}) {
  const editor = useSlateStatic();

  return (
    <InputWrapper
      className={className}
      onClick={() => ReactEditor.focus(editor)}
    >
      <HoveringToolbar />
      <SlateTemplateEditorInput
        disabled={disabled}
        placeholder={digitNumber.toString()}
        aria-label={`Custom digit ${digitNumber}`}
        tabIndex={0}
        className="no-scrollbar flex-grow overflow-hidden [&>*]:whitespace-pre"
      />
      <EmojiPicker className="relative right-[-10px] top-[-5px] h-[33px] rounded-[4px] px-[9px] text-muted-foreground hover:bg-transparent" />
    </InputWrapper>
  );
}

export default function DataSourceFormatDigitInput({
  className,
  digitNumber,
  value,
  onChange,
  disabled,
}: {
  className?: string;
  digitNumber: number;
  value: string;
  onChange: (digit: string) => void;
  disabled?: boolean;
}) {
  const deseriaizedValue = useMemo(() => deserialize(value, features), [value]);
  return (
    <SlateTemplateEditor
      features={features}
      initialValue={deseriaizedValue}
      onChange={(nodes) => {
        const serialized = serialize(nodes, features);

        if (serialized !== value) {
          onChange(serialized);
        }
      }}
    >
      <DataSourceFormatDigitInputInner
        className={className}
        digitNumber={digitNumber}
        disabled={disabled}
      />
    </SlateTemplateEditor>
  );
}
