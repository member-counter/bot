"use client";

import { createContext, useContext, useMemo } from "react";

export const DemoFormattersContext = createContext<{
  number: Intl.NumberFormat;
  date: Intl.DateTimeFormat;
} | null>(null);

export const useDemoFormatters = () => {
  const demoFormatter = useContext(DemoFormattersContext);
  if (!demoFormatter) throw new Error("DemoFormatterProvider was not used");
  return demoFormatter;
};

export const createNumberFormatter = (locale: string) => {
  const opts: Intl.NumberFormatOptions = { notation: "compact" };
  try {
    return new Intl.NumberFormat(locale, opts);
  } catch {
    return new Intl.NumberFormat("en-US", opts);
  }
};

export const createDateFormatter = (locale: string) => {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  try {
    return new Intl.DateTimeFormat(locale, opts);
  } catch {
    return new Intl.DateTimeFormat("en-US", opts);
  }
};

export default function DemoFormattersProvider({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const contextValue = useMemo(
    () => ({
      number: createNumberFormatter(locale),
      date: createDateFormatter(locale),
    }),
    [locale],
  );
  return (
    <DemoFormattersContext.Provider value={contextValue}>
      {children}
    </DemoFormattersContext.Provider>
  );
}
