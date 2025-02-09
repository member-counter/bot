import { trace } from "@opentelemetry/api";

import { OTEL_TRACER_NAME } from "./Constants";

export const tracer = trace.getTracer(OTEL_TRACER_NAME);
