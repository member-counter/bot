import { Message } from 'eris';
import ReactionManager from '../utils/ReactionManager';

const messageReactionAdd = (message: Message, emoji: any, userId: string) => {
  ReactionManager.reactionHandler(message, emoji, userId);
};

export default messageReactionAdd;
