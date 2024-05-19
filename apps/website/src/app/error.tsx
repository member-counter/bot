"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@mc/ui/button";

import { Routes } from "~/other/routes";
import { Errors } from "./errors";

const errorCodes = {
  [Errors.NotAuthenticated]: "401",
  [Errors.NotAuthorized]: "403",
  [Errors.NotFound]: "404",
};

const errorMessages = {
  [Errors.NotAuthenticated]: "You are not logged in.",
  [Errors.NotAuthorized]: "You are not authorized to access this page.",
  [Errors.NotFound]: "The page you were looking for could not be found.",
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  const router = useRouter();

  let code = "500";
  let message = "An unexpected error occurred.";
  const digest = error.digest;

  for (const [errorKey, errorMessage] of Object.entries(errorMessages)) {
    if (error.message === errorKey) {
      message = errorMessage;
      break;
    }
  }

  for (const [errorKey, errorCode] of Object.entries(errorCodes)) {
    if (error.message === errorKey) {
      code = errorCode;
      break;
    }
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
              Go home
            </Button>
          </Link>
          <Link className="inline-block" href={Routes.Support} target="_blank">
            <Button variant={"secondary"} className="w-full">
              Get support
            </Button>
          </Link>
          {reset && (
            <Button onClick={() => reset()} variant={"secondary"}>
              Try again
            </Button>
          )}
          <Button onClick={() => router.back()} variant={"secondary"}>
            Go back
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
