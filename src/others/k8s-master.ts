import Eris from "eris";
import getEnv from '../utils/getEnv';

const { DISCORD_CLIENT_TOKEN } = getEnv();

(new Eris.Client(DISCORD_CLIENT_TOKEN))
  .getBotGateway().then((gateway) => {
    // TODO
  });
