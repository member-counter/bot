export interface OldFormattingSettings {
  locale?: string | null;
  shortNumber?: number | null;
  digits?: string[] | null;
}

export interface OldCounter<ArgType> {
  format: OldFormattingSettings | null;
  name: string;
  args: ArgType;
}
