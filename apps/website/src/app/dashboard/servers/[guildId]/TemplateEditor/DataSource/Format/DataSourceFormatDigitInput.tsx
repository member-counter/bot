import type { Descendant } from "slate";
import { useMemo, useState } from "react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { InputWrapper } from "@mc/ui/InputWrapper";

import { EmojiPicker } from "../../Emoji/EmojiPicker";
import { HoveringToolbar } from "../../Marks/HoveringToolbar";
import { discordChannelTopic } from "../../serialization/deserialization/grammar/sets/discordChannelTopic";
import { deserialize } from "../../serialization/deserialize";
import { serialize } from "../../serialization/serialize";
import TemplateEditor from "../../TemplateEditor";
import TemplateEditorInput from "../../TemplateEditorInput";

const features = discordChannelTopic;

function DataSourceFormatDigitInputInner({
  className,
  digitNumber,
  onBlur,
  disabled,
}: {
  digitNumber: number;
  className?: string;
  onBlur: () => void;
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
        onBlur={onBlur}
        tabIndex={0}
        className="flex-grow overflow-hidden [&>*]:whitespace-nowrap"
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
  const [nodes, setNodes] = useState<Descendant[]>([]);
  const deseriaizedValue = useMemo(() => deserialize(value, features), [value]);

  return (
    <TemplateEditor
      features={features}
      value={deseriaizedValue}
      onChange={(nodes) => setNodes(nodes)}
    >
      <DataSourceFormatDigitInputInner
        className={className}
        digitNumber={digitNumber}
        onBlur={() => {
          const serialized = serialize(nodes, features);
          if (serialized === value) return;
          onChange(serialized);
        }}
        disabled={disabled}
      />
    </TemplateEditor>
  );
}
