import { AnyChannel, GuildChannel } from 'eris';
import updateCounterContent from '../utils/updateCounterContent';

const channelCreate = (channel: AnyChannel) => {
  if (channel instanceof GuildChannel) {
    updateCounterContent(channel);
  }
};

export default channelCreate;
