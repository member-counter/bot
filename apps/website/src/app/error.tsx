"use client";

import Link from "next/link";
import { useRouter } from "next-nprogress-bar";

import { Button } from "@mc/ui/button";

import { useTranslation } from "~/i18n/client";
import { Routes } from "~/other/routes";
import { Errors } from "./errors";

const errorCodes: Record<string, string> = {
  [Errors.NotAuthenticated]: "401",
  [Errors.NotAuthorized]: "403",
  [Errors.NotFound]: "404",
};

const errorMessages = {
  [Errors.NotAuthenticated]: "pages.error.errors.NotAuthenticated",
  [Errors.NotAuthorized]: "pages.error.errors.NotAuthorized",
  [Errors.NotFound]: "pages.error.errors.NotFound",
} as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  const router = useRouter();
  const [t] = useTranslation();

  const code = errorCodes[error.message] ?? "500";
  let message = t("pages.error.errors.InternalServerError");

  const digest = error.digest;

  if (error.message in errorMessages) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tKey = errorMessages[error.message];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    message = t(tKey);
  }

  if (error.message === Errors.NotAuthenticated) {
    window.location.href = Routes.Login;
  }

  return (
    <>
      <main className="my-auto flex flex-col items-center justify-center gap-5">
        <h1 className="text-center text-9xl font-extrabold">
          <a href={`https://http.cat/${code}`} target="_blank" rel="noreferrer">
            {code}
          </a>
        </h1>
        <h2 className="text-center text-2xl">{message}</h2>
        <div className="flex w-full flex-col justify-center gap-2 p-2 sm:flex-row">
          <Link className="inline-block" href={Routes.Home}>
            <Button variant={"secondary"} className="w-full">
              {t("pages.error.nav.homeBtn")}
            </Button>
          </Link>
          <Link className="inline-block" href={Routes.Support} target="_blank">
            <Button variant={"secondary"} className="w-full">
              {t("pages.error.nav.supportBtn")}
            </Button>
          </Link>
          {reset && (
            <Button onClick={() => reset()} variant={"secondary"}>
              {t("pages.error.nav.tryAgainBtn")}
            </Button>
          )}
          <Button onClick={() => router.back()} variant={"secondary"}>
            {t("pages.error.nav.backBtn")}
          </Button>
        </div>
      </main>
      {digest && (
        <span className="my-1 text-center text-muted-foreground">
          digest: {digest}
        </span>
      )}
    </>
  );
}
