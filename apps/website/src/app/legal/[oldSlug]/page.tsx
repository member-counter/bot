import type { LegalPagesSlugs } from "@mc/common/Routes";
import type { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

import { legalPagesSlugs } from "@mc/common/Routes";

import { pageTitle } from "~/other/pageTitle";
import { Routes } from "~/other/routes";
import { legalPages } from "../legalPages";

interface Props {
  params: Promise<{ oldSlug: string | undefined }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  let requestedSlug: LegalPagesSlugs;

  try {
    requestedSlug = z.enum(legalPagesSlugs).parse(params.oldSlug);
  } catch {
    requestedSlug = "terms-of-service";
  }

  const legalPage = legalPages[requestedSlug];

  return {
    title: pageTitle(legalPage.title),
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const requestedSlug =
    z.enum(legalPagesSlugs).safeParse(params.oldSlug).data ??
    "terms-of-service";

  redirect(Routes.Legal(requestedSlug), RedirectType.replace);
}
