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
  placeholder,
  onBlur,
}: {
  placeholder?: string;
  className?: string;
  onBlur: () => void;
}) {
  const editor = useSlateStatic();

  return (
    <InputWrapper
      className={className}
      onClick={() => ReactEditor.focus(editor)}
      onBlur={onBlur}
    >
      <HoveringToolbar />
      <TemplateEditorInput
        placeholder={placeholder}
        className="flex-grow overflow-hidden [&>*]:whitespace-nowrap"
      />
      <EmojiPicker className="relative right-[-10px] top-[-6.2px] h-[34px] rounded-[4px] px-[9.5px] text-muted" />
    </InputWrapper>
  );
}

export default function DataSourceFormatDigitInput({
  className,
  placeholder,
  initialValue,
  onChange,
  readAgainInitialValue,
}: {
  className?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        onBlur={() => onChange(serialize(value, features))}
      />
    </TemplateEditor>
  );
}
