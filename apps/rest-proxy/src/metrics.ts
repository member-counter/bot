import { metrics } from "@opentelemetry/api";

// Instruments come from the global meter provider, which is a no-op unless
// the process registers an OpenTelemetry SDK, so recording is free when
// telemetry isn't configured.
const meter = metrics.getMeter("rest-proxy");

const requestsTotal = meter.createCounter("discord_proxy_requests", {
  description: "Proxied Discord REST requests",
});

const requestDuration = meter.createHistogram(
  "discord_proxy_request_duration_ms",
  {
    description:
      "Time from receiving a proxied request to answering it, including time queued at the rate limiter",
  },
);

const rateLimitHits = meter.createCounter("discord_proxy_ratelimit_hits", {
  description: "Rate limit hits reported by the REST client",
});

const requestsInFlight = meter.createUpDownCounter(
  "discord_proxy_requests_in_flight",
  {
    description:
      "Proxied requests currently being handled, including queue time",
  },
);

// Discord blocks the IP for a while when it sees 10k invalid requests
// (401/403/429) within 10 minutes; the REST client reports progress in
// batches, so expose the latest count for the current window
const INVALID_REQUEST_WINDOW_MS = 10 * 60 * 1000;
let lastInvalidRequestWarning = { count: 0, at: 0 };

const invalidRequestsGauge = meter.createObservableGauge(
  "discord_proxy_invalid_requests_window",
  {
    description:
      "Invalid requests reported for the current 10 minute window; Discord blocks the IP at 10k",
  },
);
invalidRequestsGauge.addCallback((result) => {
  const { count, at } = lastInvalidRequestWarning;
  result.observe(Date.now() - at < INVALID_REQUEST_WINDOW_MS ? count : 0);
});

/**
 * Replaces snowflakes and tokens so paths group into route templates
 * (/channels/123... -> /channels/:id) and label cardinality stays bounded.
 */
export function normalizeRoute(pathname: string): string {
  return pathname
    .replace(/^\/api(\/v\d+)?/, "")
    .split("/")
    .map((segment) => {
      if (/^\d{15,21}$/.test(segment)) return ":id";
      if (segment.length >= 30) return ":token";
      return segment;
    })
    .join("/");
}

export function recordRequestStart() {
  requestsInFlight.add(1);
}

export function recordRequestEnd(opts: {
  method: string;
  route: string;
  status: number;
  durationMs: number;
}) {
  requestsInFlight.add(-1);

  requestsTotal.add(1, {
    method: opts.method,
    route: opts.route,
    status: String(opts.status),
  });
  requestDuration.record(opts.durationMs, {
    method: opts.method,
    route: opts.route,
  });
}

export function recordRateLimitHit(opts: {
  global: boolean;
  method: string;
  route: string;
}) {
  rateLimitHits.add(1, {
    scope: opts.global ? "global" : "route",
    method: opts.method,
    route: opts.route,
  });
}

export function recordInvalidRequestWarning(count: number) {
  lastInvalidRequestWarning = { count, at: Date.now() };
}
