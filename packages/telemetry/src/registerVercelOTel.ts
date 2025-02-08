import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { registerOTel as _registerVercelOTel } from "@vercel/otel";

import { env } from "./env";

export function registerVercelOTel() {
  _registerVercelOTel({
    serviceName: env.OTEL_SERVICE_NAME,
    instrumentations: [new PrismaInstrumentation()],
    spanProcessors: [
      "auto",
      env.NODE_ENV === "production"
        ? new BatchSpanProcessor(new OTLPTraceExporter())
        : new SimpleSpanProcessor(new OTLPTraceExporter()),
    ],
  });
}
