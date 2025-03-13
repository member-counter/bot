import type { Locale } from "discord.js";
import type { i18n } from "i18next";

export type TFunction = i18n["t"];

type Unpacked<T> = T extends (infer U)[] ? U : T;
export type TKey<K = Parameters<TFunction>[0]> = K extends
  | string
  | string[]
  | TemplateStringsArray
  ? never
  : Exclude<Unpacked<K>, TemplateStringsArray>;

export const tKey = <K extends TKey>(key: K): K => key;

export interface InitI18NOptions {
  locale: Locale;
}
