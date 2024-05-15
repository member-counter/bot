import type { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

import type { LegalPagesSlugs } from "../legalPages";
import { legalPages, legalPagesSlugs } from "../legalPages";

interface Props {
  params: { oldSlug: string | undefined };
}

export function generateMetadata({ params }: Props): Metadata {
  let requestedSlug: LegalPagesSlugs;

  try {
    requestedSlug = z.enum(legalPagesSlugs).parse(params.oldSlug);
  } catch {
    requestedSlug = "terms-of-service";
  }

  const legalPage = legalPages[requestedSlug];

  return {
    title: legalPage.title + " - Member Counter",
  };
}

export default function Page({ params }: Props) {
  const requestedSlug =
    z.enum(legalPagesSlugs).safeParse(params.oldSlug).data ??
    "terms-of-service";

  redirect("/legal?page=" + requestedSlug, RedirectType.replace);
}
