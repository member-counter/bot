import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function catchErrors(
  handler: (
    request: NextRequest,
  ) => Promise<NextResponse | void> | NextResponse | void,
) {
  return async function (request: NextRequest) {
    try {
      return await handler(request);
    } catch (err) {
      return errorHandler(err);
    }
  };
}

export class UserHttpError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

function errorHandler(err: unknown): NextResponse {
  // We aren't supposed to catch this, throw it back!
  if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;

  if (err instanceof UserHttpError) {
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode },
    );
  }

  console.error(err);
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 },
  );
}
