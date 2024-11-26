"use client";

import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

import { BitField } from "@mc/common/BitField";
import { UserPermissions } from "@mc/common/UserPermissions";
import { cn } from "@mc/ui";
import { Link } from "@mc/ui/Link";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

export default function Footer() {
  const { t } = useTranslation();
  const isAuthenticated = api.session.isAuthenticated.useQuery();
  const user = api.session.user.useQuery(undefined);

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
              <Link href={Routes.Support}>
                {t("components.footer.supportServer")}
              </Link>
              <Link href={Routes.Documentation}>
                {t("components.footer.documentation")}
              </Link>
              {!isAuthenticated.data ? (
                <Link href={Routes.Login}>
                  {t("components.footer.loginWithDiscord")}
                </Link>
              ) : (
                <Link href={Routes.LogOut}>
                  {t("components.footer.logout")}
                </Link>
              )}
            </div>
            <div>
              <h3>{t("components.footer.legal")}</h3>
              <Link href={Routes.Legal("terms-of-service")}>
                {t("components.footer.termsOfService")}
              </Link>
              <Link href={Routes.Legal("cookie-policy")}>
                {t("components.footer.cookiePolicy")}
              </Link>
              <Link href={Routes.Legal("privacy-policy")}>
                {t("components.footer.privacyPolicy")}
              </Link>
              <Link href={Routes.Legal("acceptable-use-policy")}>
                {t("components.footer.acceptableUsePolicy")}
              </Link>
            </div>
            <div>
              <h3>{t("components.footer.improveMemberCounter")}</h3>
              <Link href={Routes.BotRepository}>
                {t("components.footer.codeRepository")}
              </Link>
              <Link href={Routes.Translate}>
                {t("components.footer.translateBot")}
              </Link>
              <Link href={Routes.Donors}>{t("components.footer.donate")}</Link>
            </div>
            <div
              className={cn({
                hidden: !userPermissions.has(
                  UserPermissions.SeeUsers |
                    UserPermissions.ManageUsers |
                    UserPermissions.SeeGuilds |
                    UserPermissions.ManageGuilds,
                ),
              })}
            >
              <h3>{t("components.footer.admin")}</h3>
              <Link
                href={Routes.ManageUsers()}
                className={cn({
                  hidden: !userPermissions.has(
                    UserPermissions.SeeUsers | UserPermissions.ManageUsers,
                  ),
                })}
              >
                {t("components.footer.manageUsers")}
              </Link>
              <Link
                href={Routes.ManageGuilds}
                className={cn({
                  hidden: !userPermissions.has(
                    UserPermissions.SeeGuilds | UserPermissions.ManageGuilds,
                  ),
                })}
              >
                {t("components.footer.manageServers")}
              </Link>
              <Link
                href={Routes.ManageHomePage}
                className={cn({
                  hidden: !userPermissions.has(UserPermissions.ManageHomePage),
                })}
              >
                {t("components.footer.manageHomePage")}
              </Link>
              <Link
                href={Routes.ManageDonations()}
                className={cn({
                  hidden: !userPermissions.has(UserPermissions.ManageDonations),
                })}
              >
                {t("components.footer.manageDonations")}
              </Link>
              <Link href={Routes.Sentry}>{t("components.footer.sentry")}</Link>
            </div>
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
                      href="https://eduardozgz.com/"
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
                      href="https://github.com/VampireChicken12/"
                    >
                      VampireChicken
                    </LinkUnderlined>
                  ),
                  livingfloreLink: (
                    <LinkUnderlined
                      target="_blank"
                      href="https://livingflo.re/"
                    >
                      livingflore
                    </LinkUnderlined>
                  ),
                  donorsLink: <LinkUnderlined href={Routes.Donors} />,
                }}
              />
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
