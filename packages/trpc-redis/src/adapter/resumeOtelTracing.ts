import type { SpanContext } from "@opentelemetry/api";
import { context, trace, TraceFlags } from "@opentelemetry/api";

export const resumeOtelTracing = <F extends () => ReturnType<F>>(
  traceId: string,
  spanId: string,
  fn: F,
): ReturnType<F> => {
  const spanContext: SpanContext = {
    traceId,
    spanId,
    isRemote: true,
    traceFlags: TraceFlags.SAMPLED,
  };
  const remoteContext = trace.setSpanContext(context.active(), spanContext);

  return context.with(remoteContext, fn);
};
