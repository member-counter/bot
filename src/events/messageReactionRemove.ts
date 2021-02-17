import { AnyChannel, GuildChannel, Message } from "eris";
import ReactionManager from "../utils/ReactionManager";

const messageReactionRemove = (
	message: Message,
	emoji: any,
	userId: string
) => {
	ReactionManager.reactionHandler(message, emoji, userId);
};

export default messageReactionRemove;
