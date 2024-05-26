import { useMemo } from "react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { InputWrapper } from "@mc/ui/InputWrapper";

import { EmojiPicker } from "../../Emoji/EmojiPicker";
import { HoveringToolbar } from "../../Marks/HoveringToolbar";
import { discordChannelTopic } from "../../serde/deserialization/grammar/sets/discordChannelTopic";
import { deserialize } from "../../serde/deserialize";
import { serialize } from "../../serde/serialize";
import TemplateEditor from "../../TemplateEditor";
import TemplateEditorInput from "../../TemplateEditorInput";

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
      <TemplateEditorInput
        disabled={disabled}
        placeholder={digitNumber.toString()}
        aria-label={`Custom digit ${digitNumber}`}
        tabIndex={0}
        className="flex-grow overflow-hidden [&>*]:whitespace-pre"
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
    <TemplateEditor
      features={features}
      initialValue={deseriaizedValue}
      onChange={(nodes) => onChange(serialize(nodes, features))}
    >
      <DataSourceFormatDigitInputInner
        className={className}
        digitNumber={digitNumber}
        disabled={disabled}
      />
    </TemplateEditor>
  );
}
