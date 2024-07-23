import "~/globals.css";

import { Inter } from "next/font/google";

import { I18nProvider } from "~/i18n/client";
import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "./components/NavBar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  title: "Member Counter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        className={`${inter.className} antialiasing dark flex min-h-screen flex-col`}
        style={{ backgroundColor: "#0c0a09" }}
      >
        <I18nProvider>
          <TRPCReactProvider>
            <NavBar />
            {children}
          </TRPCReactProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
