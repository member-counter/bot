"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { env } from "~/env";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center items-center gap-4 text-sm lg:gap-6">
        <Link href="/"></Link>
        <a
          href={env.NEXT_PUBLIC_SUPPORT_URL}
          target="_blank"
          rel="noreferer   "
        >
          Support
        </a>
        <Link href="/"></Link>
        <Link href="/"></Link>
      </nav>
    </header>
  );
}
