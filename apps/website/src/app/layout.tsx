import "~/globals.css";

import { Inter } from "next/font/google";

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
    <html lang="en">
      <body
        className={`${inter.className} antialiasing`}
        style={{ backgroundColor: "#27272a" }}
      >
        <TRPCReactProvider>
          <NavBar />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
