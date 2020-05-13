import { AnyChannel, GuildChannel } from 'eris';
import updateCounterContent from '../counts/updateCounterContent';

const channelUpdate = (channel: AnyChannel) => {
  if (channel instanceof GuildChannel) {
    updateCounterContent(channel);
  }
};

export default channelUpdate;
