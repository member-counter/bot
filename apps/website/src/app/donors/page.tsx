import type { Metadata } from "next";

import { pageTitle } from "~/other/pageTitle";
import { Donors } from "./Donors";

export const metadata: Metadata = { title: pageTitle("Donors") };
export default function Page() {
  return <Donors />;
}
