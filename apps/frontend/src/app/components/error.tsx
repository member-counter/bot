import { useTranslation } from "react-i18next";

import { routes } from "@mc/common/Routes";
import { Errors } from "@mc/trpc-api/utils/errors";
import { Button } from "@mc/ui/button";

import { Link, useNavigate } from "~/lib/navigation";

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

export default function ErrorPage({ error }: { error: Error }) {
  const navigate = useNavigate();
  const [t] = useTranslation();

  const code = errorCodes[error.message] ?? "500";
  let message = t("pages.error.errors.InternalServerError");

  if (error.message in errorMessages) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const tKey = errorMessages[error.message];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    message = t(tKey);
  }

  if (error.message === Errors.NotAuthenticated) {
    void navigate(routes.login.$buildPath({}));
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
          <Link className="inline-block" to={routes.$buildPath({})}>
            <Button variant={"secondary"} className="w-full">
              {t("pages.error.nav.homeBtn")}
            </Button>
          </Link>
          <Link
            className="inline-block"
            to={routes.support.$buildPath({})}
            target="_blank"
          >
            <Button variant={"secondary"} className="w-full">
              {t("pages.error.nav.supportBtn")}
            </Button>
          </Link>
          <Button onClick={() => navigate(-1)} variant={"secondary"}>
            {t("pages.error.nav.backBtn")}
          </Button>
        </div>
      </main>
    </>
  );
}
