import type { Metadata } from "next";
import { z } from "zod";

import Footer from "~/app/components/Footer";
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
    title: legalPage.title + " - Member Counter",
  };
}

export default function Page() {
  return (
    <>
      <PageSwitcher />
      <Footer />
    </>
  );
}
