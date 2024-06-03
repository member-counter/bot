type ConvertToPath<T, P extends string = ""> = {
  [K in keyof T]: K extends string
    ? T[K] extends object
      ? ConvertToPath<T[K], `${P}${K}.`>
      : string
    : T[K];
};

export function enforcePathAsValue<T>(
  obj: T,
  parentKey = "",
): ConvertToPath<T> {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const path = parentKey ? `${parentKey}.${key}` : key;
      const child = obj[key];
      if (
        typeof child === "object" &&
        child !== null &&
        !Array.isArray(child)
      ) {
        result[key] = enforcePathAsValue(child, path);
      } else {
        result[key] = path;
      }
    }
  }

  return result as ConvertToPath<T>;
}
