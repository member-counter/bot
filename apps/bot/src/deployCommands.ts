#!/usr/bin/env node
import logger from "@mc/logger";

import { deployCommands } from "./utils/deployCommands";

void (async () => {
  try {
    await deployCommands();
  } catch (error) {
    logger.error(
      `deployCommands: Failed to reload application commands.`,
      error,
    );
  }
})();
