import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import { BitField } from "@mc/common/BitField";
import { routes } from "@mc/common/Routes";
import { UserPermissions } from "@mc/common/UserPermissions";
import { cn } from "@mc/ui";

import { Link } from "~/app/components/Link";
import { LinkUnderlined } from "~/app/components/LinkUnderlined";
import { api } from "~/lib/trpc";

export default function Footer() {
  const { t } = useTranslation();
  const isAuthenticated = api.session.isAuthenticated.useQuery();
  const user = api.session.user.useQuery(undefined, {
    retry: false,
  });

  const userPermissions = useMemo(
    () => new BitField(user.data?.permissions),
    [user.data],
  );

  return (
    <>
      <footer className="mt-auto flex flex-col border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="bg-accent-background py-5">
          <div className="container flex flex-row flex-wrap gap-[60px] py-0 [&>*>h3]:pb-5 [&>*>h3]:text-xl [&>*>h3]:font-bold [&>*>h3]:tracking-tight [&>*]:flex [&>*]:max-w-[240px] [&>*]:flex-col">
            <div>
              <h3>{t("components.footer.usefulLinks")}</h3>
              <a href={routes.support.$buildPath({})} target="_blank">
                {t("components.footer.supportServer")}
              </a>
              <a href={routes.docs.$buildPath({})} target="_blank">
                {t("components.footer.documentation")}
              </a>
              {!isAuthenticated.data ? (
                <Link to={routes.login.$buildPath({})}>
                  {t("components.footer.loginWithDiscord")}
                </Link>
              ) : (
                <Link to={routes.logout.$buildPath({})}>
                  {t("components.footer.logout")}
                </Link>
              )}
              <Link to={routes.status.$buildPath({})}>
                {t("components.footer.status")}
              </Link>
            </div>
            <div>
              <h3>{t("components.footer.legal")}</h3>
              <Link
                to={routes.legal.page.$buildPath({
                  params: { page: "terms-of-service" },
                })}
              >
                {t("components.footer.termsOfService")}
              </Link>
              <Link
                to={routes.legal.page.$buildPath({
                  params: { page: "cookie-policy" },
                })}
              >
                {t("components.footer.cookiePolicy")}
              </Link>
              <Link
                to={routes.legal.page.$buildPath({
                  params: { page: "privacy-policy" },
                })}
              >
                {t("components.footer.privacyPolicy")}
              </Link>
              <Link
                to={routes.legal.page.$buildPath({
                  params: { page: "acceptable-use-policy" },
                })}
              >
                {t("components.footer.acceptableUsePolicy")}
              </Link>
            </div>
            <div>
              <h3>{t("components.footer.improveMemberCounter")}</h3>
              <Link to={routes.repository.$buildPath({})}>
                {t("components.footer.codeRepository")}
              </Link>
              <Link to={routes.translate.$buildPath({})}>
                {t("components.footer.translateBot")}
              </Link>
              <Link to={routes.donate.$buildPath({})}>
                {t("components.footer.donate")}
              </Link>
            </div>
            {!!userPermissions.bitfield && (
              <div>
                <h3>{t("components.footer.admin")}</h3>
                <Link
                  to={routes.admin.users.$buildPath({})}
                  className={cn({
                    hidden: !userPermissions.has(
                      UserPermissions.SeeUsers | UserPermissions.ManageUsers,
                    ),
                  })}
                >
                  {t("components.footer.manageUsers")}
                </Link>
                <Link
                  to={routes.admin.guilds.$buildPath({})}
                  className={cn({
                    hidden: !userPermissions.has(
                      UserPermissions.SeeGuilds | UserPermissions.ManageGuilds,
                    ),
                  })}
                >
                  {t("components.footer.manageServers")}
                </Link>
                <Link
                  to={routes.admin.homepage.$buildPath({})}
                  className={cn({
                    hidden: !userPermissions.has(
                      UserPermissions.ManageHomePage,
                    ),
                  })}
                >
                  {t("components.footer.manageHomePage")}
                </Link>
                <Link
                  to={routes.admin.donations.$buildPath({})}
                  className={cn({
                    hidden: !userPermissions.has(
                      UserPermissions.ManageDonations,
                    ),
                  })}
                >
                  {t("components.footer.manageDonations")}
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-border/40 bg-[#090807] bg-background py-4">
          <div className="container flex flex-row py-0">
            <span className="">
              <Trans
                i18nKey="components.footer.copyright"
                values={{ year: new Date().getFullYear() }}
                components={{
                  eduardozgzLink: (
                    <LinkUnderlined
                      target="_blank"
                      to="https://eduardozgz.com/"
                    >
                      eduardozgz
                    </LinkUnderlined>
                  ),
                }}
              />
              <br />
              <Trans
                i18nKey="components.footer.madePossibleThanksTo"
                components={{
                  vampireChickenLink: (
                    <LinkUnderlined
                      target="_blank"
                      to="https://github.com/VampireChicken12/"
                    >
                      VampireChicken
                    </LinkUnderlined>
                  ),
                  livingfloreLink: (
                    <LinkUnderlined target="_blank" to="https://livingflo.re/">
                      livingflore
                    </LinkUnderlined>
                  ),
                  donorsLink: (
                    <LinkUnderlined to={routes.donors.$buildPath({})} />
                  ),
                }}
              />
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
