import Eris, { Member, Message } from "eris";
import ReactionManager from "../utils/ReactionManager";

const messageReactionAdd = (
	message: Message,
	emoji: any,
	member: Eris.MemberPartial
) => {
	ReactionManager.reactionHandler(message, emoji, member.id);
};

export default messageReactionAdd;
