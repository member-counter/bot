import { Client, Message } from 'eris';

interface runArgs {
  client: Client;
  message: Message;
  languagePack: object;
}

interface runFunction {
  ({ client, message, languagePack }: runArgs): void;
}

interface MemberCounterCommand {
  aliases: string[];
  denyDm: boolean;
  onlyAdmin: boolean;
  run: runFunction;
}

export default MemberCounterCommand;
