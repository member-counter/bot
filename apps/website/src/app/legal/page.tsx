import type { Metadata } from "next";
import { Suspense } from "react";
import { z } from "zod";

import Footer from "~/app/components/Footer";
import { pageTitle } from "~/other/pageTitle";
import { legalPages, legalPagesSlugs } from "./legalPages";
import PageSwitcher from "./PageSwitcher";

interface Props {
  searchParams: { page: string | undefined };
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const requestedSlug =
    z.enum(legalPagesSlugs).safeParse(searchParams.page).data ??
    "terms-of-service";

  const legalPage = legalPages[requestedSlug];

  return {
    title: pageTitle(legalPage.title),
  };
}

export default function Page() {
  return (
    <>
      <Suspense>
        <PageSwitcher />
      </Suspense>
      <Footer />
    </>
  );
}
