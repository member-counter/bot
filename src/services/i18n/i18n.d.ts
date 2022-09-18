import { TOptions } from "i18next";
import en from "../../locales/en-US.json";

// T is the dictionary, S is the next string part of the object property path
// If S does not match dict shape, return its next expected properties

type DeepKeys<
	T extends object,
	S extends string
> = S extends `${infer I1}.${infer I2}`
	? I1 extends keyof T
		? `${I1}.${DeepKeys<
				Omit<Omit<T[I1], DeepKeys<string, "">>, DeepKeys<Array<undefined>, "">>,
				I2
		  >}`
		: keyof T & string
	: S extends keyof T
	? `${S}`
	: keyof T & string;

// returns property value from object O given property path T, otherwise never
type GetDictValue<T extends string, O> = T extends `${infer A}.${infer B}`
	? A extends keyof O
		? GetDictValue<B, O[A]>
		: never
	: T extends keyof O
	? O[T]
	: never;

// returns property value from object O given property path T if result is string
type GetDictValueString<T, O> = T extends `${infer A}.${infer B}`
	? A extends keyof O
		? GetDictValue<B, O[A]>
		: never
	: T extends keyof O
	? O[T] extends string
		? O[T]
		: never
	: never;

// retrieves all variable placeholder names as tuple
type Keys<S extends string> = S extends ""
	? []
	: // eslint-disable-next-line @typescript-eslint/no-unused-vars
	S extends `${infer _}{{${Trim<infer B>}}}${infer C}`
	? [B, ...Keys<C>]
	: [];

// substitutes placeholder variables with input values
type Interpolate<
	S extends string,
	I extends Record<Keys<S>[number], string>
> = S extends ""
	? ""
	: S extends `${infer A}{{${infer B}}}${infer C}`
	? `${A}${I[Extract<B, keyof I>]}${Interpolate<C, I>}`
	: `${S}`;

type Dict = typeof en;
export interface TranslateFunction {
	// basic usage
	<S extends string>(key: DeepKeys<Dict, S>): GetDictValue<S, Dict>;
	<
		K extends string,
		I extends { [K in Keys<V>[number]]: string },
		V extends GetDictValueString<K, Dict>
	>(
		key: DeepKeys<Dict, K>,
		options: TOptions<I> & {
			returnDetails: true;
			returnObjects: true;
		}
	): Interpolate<V, I>;
	<
		K extends string,
		I extends { [K in Keys<V>[number]]: string },
		V extends GetDictValueString<K, Dict>
	>(
		key: DeepKeys<Dict, K>,
		options: TOptions<I> & { returnDetails: true }
	): Interpolate<V, I>;
	<
		K extends string,
		I extends { [K in Keys<V>[number]]: string },
		V extends GetDictValueString<K, Dict>
	>(
		key: DeepKeys<Dict, K>,
		options: TOptions<I> & { returnObjects: true }
	): Interpolate<V, I>;
	<
		K extends string,
		I extends { [K in Keys<V>[number]]: string },
		V extends GetDictValueString<K, Dict>
	>(
		key: DeepKeys<Dict, K>,
		options: TOptions<I> | string
	): Interpolate<V, I>;
	// overloaded usage
	<
		K extends string,
		I extends { [K in Keys<V>[number]]: string },
		V extends GetDictValueString<K, Dict>
	>(
		key: DeepKeys<Dict, K>,
		defaultValue?: string,
		options: TOptions<I> | string
	): Interpolate<V, I>;
}
