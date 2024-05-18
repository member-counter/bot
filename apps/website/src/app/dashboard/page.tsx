import type { Metadata } from "next";

import { pageTitle } from "~/other/pageTitle";

export const metadata: Metadata = { title: pageTitle("Dashboard") };
export default function Page() {
  return <>{"// TODO exlpain how the bot works"}</>;
}
