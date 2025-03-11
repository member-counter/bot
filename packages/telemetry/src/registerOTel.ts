/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createRequire } from "module";
import type { PrismaInstrumentation as PrismaInstrumentationT } from "@prisma/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { registerOTel as _registerVercelOTel } from "@vercel/otel";

import { env } from "./env";

const require = createRequire(import.meta.url);

// https://github.com/prisma/prisma/issues/23410
// https://github.com/prisma/prisma/discussions/25916
const PrismaInstrumentation = require("@prisma/instrumentation")
  .PrismaInstrumentation as typeof PrismaInstrumentationT;

export function registerOTel() {
  const sdk = new NodeSDK({
    instrumentations: [new PrismaInstrumentation()],
    spanProcessors: [
      env.NODE_ENV === "production"
        ? new BatchSpanProcessor(new OTLPTraceExporter())
        : new SimpleSpanProcessor(new OTLPTraceExporter()),
    ],
  });

  sdk.start();

  process.on("SIGTERM", () => {
    void sdk.shutdown();
  });
}
