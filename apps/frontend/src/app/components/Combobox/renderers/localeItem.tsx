import type { ComboboxProps } from "..";
import { LocaleItem } from "../items/LocaleItem";

type T = string;
type ItemProps = Parameters<ComboboxProps<T>["onItemRender"]>[0];

export const localeItem = () => (props: ItemProps) => (
  <LocaleItem {...props} item={props.item} />
);
