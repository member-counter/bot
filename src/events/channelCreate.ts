import { AnyChannel, GuildChannel } from 'eris';
import updateCounterContent from '../counts/updateCounterContent';

const channelCreate = (channel: AnyChannel) => {
  if (channel instanceof GuildChannel) {
    updateCounterContent(channel);
  }
};

export default channelCreate;
