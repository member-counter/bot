import { setImmediate as yieldToEventLoop } from "node:timers/promises";

import { KnownError } from "@mc/common/KnownError/index";

// Give the event loop a turn after this much CPU time. Timers, network I/O
// and the Discord gateway heartbeat then run during a long evaluation.
const MAX_BLOCKING_MS = 10;

/**
 * Lets a long evaluation give the event loop a turn, and stops it when the
 * evaluation is cancelled.
 *
 * A long loop calls `shouldYield()` every few iterations. It is cheap. When it
 * returns true, the loop calls `yield()`.
 *
 * An `await` of a resolved promise does not give the event loop a turn: it
 * only lets other microtasks run. `yield()` waits for setImmediate, which
 * runs after pending I/O and timers.
 */
export class EvaluationScheduler {
  private lastYieldAt = performance.now();

  constructor(public readonly signal: AbortSignal) {}

  /** Return true when the evaluation ran for MAX_BLOCKING_MS without a turn. */
  shouldYield() {
    return performance.now() - this.lastYieldAt >= MAX_BLOCKING_MS;
  }

  /**
   * Give the event loop a turn. Throw EVALUATION_TIMEOUT when the evaluation
   * was cancelled before or during the turn.
   */
  async yield() {
    this.throwIfCancelled();
    await yieldToEventLoop();
    this.lastYieldAt = performance.now();
    this.throwIfCancelled();
  }

  throwIfCancelled() {
    if (this.signal.aborted) throw new KnownError("EVALUATION_TIMEOUT");
  }
}
