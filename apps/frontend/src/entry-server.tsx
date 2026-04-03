import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

import { routes } from "@mc/common/Routes";

import { fallbackLng, languages } from "~/lib/i18n";
import ServerApp from "./ServerApp";

/** Routes to pre-render at build time. */
export const prerenderRoutes = [routes.$buildPath({})];

/** Languages to pre-render for each route. */
export { languages, fallbackLng };

// -- Render --

export async function render(
  url: string,
  lang: (typeof languages)[number] = fallbackLng,
): Promise<string> {
  const element = <ServerApp url={url} lang={lang} />;

  return new Promise((resolve, reject) => {
    let html = "";

    const { pipe } = renderToPipeableStream(element, {
      onAllReady() {
        const writable = new Writable({
          write(chunk: Buffer, _encoding, callback) {
            html += chunk.toString();
            callback();
          },
          final(callback) {
            resolve(html);
            callback();
          },
        });
        pipe(writable);
      },
      onShellError(error: unknown) {
        if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error("Unknown error", { cause: error }));
        }
      },
      onError(error: unknown) {
        console.error("SSR error:", error);
      },
    });
  });
}
