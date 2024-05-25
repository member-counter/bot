import type { Descendant } from "slate";
import { useMemo, useState } from "react";
import { ReactEditor, useSlateStatic } from "slate-react";

import { InputWrapper } from "@mc/ui/InputWrapper";

import { EmojiPicker } from "../../Emoji/EmojiPicker";
import { HoveringToolbar } from "../../Marks/HoveringToolbar";
import { discordChannelTopicMarkdown } from "../../serialization/deserialization/grammar/sets/discordChannelTopicMarkdown";
import { deserialize } from "../../serialization/deserialize";
import { serialize } from "../../serialization/serialize";
import TemplateEditor from "../../TemplateEditor";
import TemplateEditorInput from "../../TemplateEditorInput";

const features = discordChannelTopicMarkdown;

function DataSourceFormatDigitInputInner({
  className,
  digitNumber,
  onBlur,
}: {
  digitNumber: number;
  className?: string;
  onBlur: () => void;
}) {
  const editor = useSlateStatic();

  return (
    <InputWrapper className={className}>
      <HoveringToolbar />
      <TemplateEditorInput
        placeholder={digitNumber.toString()}
        aria-label={`Custom digit ${digitNumber}`}
        onClick={() => ReactEditor.focus(editor)}
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
  initialValue,
  onChange,
  readAgainInitialValue,
}: {
  className?: string;
  digitNumber: number;
  initialValue: string;
  onChange: (digit: string) => void;
  readAgainInitialValue?: number;
}) {
  const [value, setValue] = useState<Descendant[]>([]);
  const deseriaizedInitialValue = useMemo(
    () => deserialize(initialValue, features),
    [initialValue],
  );

  return (
    <TemplateEditor
      features={features}
      initialValue={deseriaizedInitialValue}
      readAgainInitialValue={readAgainInitialValue}
      onChange={(nodes) => setValue(nodes)}
    >
      <DataSourceFormatDigitInputInner
        className={className}
        digitNumber={digitNumber}
        onBlur={() => onChange(serialize(value, features))}
      />
    </TemplateEditor>
  );
}
