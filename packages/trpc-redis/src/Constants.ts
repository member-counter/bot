export const REQ_CHANNEL = "trpc-req";
export const RES_CHANNEL = "trpc-res";

// Error message a request rejects with when no instance answers in time;
// consumers match on it to react to "nobody serves this" without retrying
export const REQUEST_TIMEOUT_MESSAGE = "Request timed out";
