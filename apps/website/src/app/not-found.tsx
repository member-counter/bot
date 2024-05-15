"use client";

import { Errors } from "./errors";

export default function NotFound() {
  throw new Error(Errors.NotFound);
}
