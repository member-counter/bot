import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";

import { routes } from "@mc/common/Routes";

import ServerApp from "./ServerApp";

/** Routes to pre-render at build time. */
export const prerenderRoutes = [routes.$buildPath({})];

// -- Render --

export async function render(url: string): Promise<string> {
  const element = <ServerApp url={url} />;

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
