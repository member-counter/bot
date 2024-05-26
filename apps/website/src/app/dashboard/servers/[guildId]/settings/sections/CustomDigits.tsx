/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { cn } from "@mc/ui";
import { Label } from "@mc/ui/label";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import DataSourceFormatDigitInput from "../../TemplateEditor/DataSource/Format/DataSourceFormatDigitInput";

interface Props {
  readyToInitiate: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
}

export function CustomDigits({
  value,
  onChange,
  disabled,
  readyToInitiate,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <Label>Custom digits</Label>{" "}
      <p className="text-sm text-muted-foreground">
        In counters that return a number, Member counter will replace each digit
        with the ones you provide. This is useful if you want to display custom
        emojis or something else, such as "unicode style fonts."
      </p>
      <p className="text-sm text-muted-foreground">
        <b>
          Keep in mind that users using a screen reader (text-to-speech) may not
          be able to understand the customized digits and{" "}
          <LinkUnderlined
            href="https://x.com/kentcdodds/status/1083073242330361856"
            target="_blank"
            referrerPolicy="no-referrer"
          >
            may hear something unintelligible
          </LinkUnderlined>
          . Screen readers are often used by people with visual disabilities.{" "}
        </b>
      </p>
      <p className="text-sm text-muted-foreground">
        We do not recommend customizing any digit unless you are certain that
        nobody using a screen reader will have access to any counter.
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {readyToInitiate &&
          new Array(10).fill("").map((_, i) => {
            return (
              <DataSourceFormatDigitInput
                key={i}
                className={cn({ "col-span-3": i === 0 })}
                value={value[i] || i.toString()}
                onChange={(digit) => {
                  value[i] = digit || i.toString();
                  onChange(value);
                }}
                digitNumber={i}
                disabled={disabled}
              />
            );
          })}
      </div>
    </div>
  );
}
