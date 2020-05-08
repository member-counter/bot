import { Message } from 'eris';

interface runArgs {
  message: Message;
  languagePack: any;
}

interface runFunction {
  ({ message, languagePack }: runArgs): Promise<void>;
}

interface MemberCounterCommand {
  aliases: string[];
  denyDm: boolean;
  onlyAdmin: boolean;
  run: runFunction;
}

export default MemberCounterCommand;
