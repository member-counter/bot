import { TranslationPlaceholders, Translations } from "../Constants";

// Create errors with this class whenever you want to display an error message to the user instead of returning a generic message like "Something wrong happened"
export class UserError<T extends Translations> extends Error {
	message: T;
	constructor(
		message: T,
		public placeholderData?: typeof TranslationPlaceholders[T]
	) {
		super(message);
	}
}
