import { trace } from "@opentelemetry/api";
import { initTRPC } from "@trpc/server";

export function trpcTracing() {
  const tracer = trace.getTracer("@mc/trpc-telemetry");
  const t = initTRPC.create();

  return t.procedure.use((opts) =>
    tracer.startActiveSpan(
      `TRPC Procedure ${opts.path} ${opts.type}`,
      async (span) => {
        const result = await opts.next();
        span.setAttributes({
          path: opts.path,
          type: opts.type,
          ok: result.ok,
        });

        span.end();

        return result;
      },
    ),
  );
}
